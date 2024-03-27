use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::{de::DeserializeOwned, Deserialize, Serialize};

pub trait KeyValueStoreMethods {
    type D;

    fn insert_and_replace(&self);
    fn get(&self) -> Result<Self::D, ()>;
    fn remove(&self);
    fn full_path(&self) -> PathBuf;
}

#[derive(Serialize, Clone)]
pub struct KeyValueStore<T: Serialize + DeserializeOwned> {
    pub dirname: String,
    pub filename: String,
    pub contents: T,
}


impl<T: Serialize + DeserializeOwned> KeyValueStoreMethods for KeyValueStore<T> {
    type D = T;
    fn insert_and_replace(&self) {
        let path = self.full_path();
        let dir = Path::new(&self.dirname);

        if !dir.exists() {
            fs::create_dir(&self.dirname).unwrap();
        }

        let contents = serde_json::to_string(&self.contents).unwrap();
        fs::write(path, contents.as_bytes()).unwrap();
    }

    fn get(&self) -> Result<T, ()> {
        let path = self.full_path();

        if path.exists() {
            let file = fs::read_to_string(path).unwrap();

            let data = serde_json::from_str::<T>(file.as_str()).unwrap();

            Ok(data)
        } else {
            Err(())
        }
    }

    fn remove(&self) {
        if self.full_path().exists() {
            fs::remove_file(self.full_path()).unwrap();
        }
    }

    fn full_path(&self) -> PathBuf {
        let path = Path::new(&self.dirname);

        let path_buf = PathBuf::from(path);
        path_buf.join(&self.filename)
    }
}
