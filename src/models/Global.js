import { useSignalJs } from "../helpers/index.js"
import Invoke from "../invoke/index.js"

export default class extends Invoke {
    constructor(tableName) {
        super()
        this.idString = "id"
        this.tableName = tableName
        this.context = useSignalJs({
            contextValue: [],
            contextType: ""
        })
    }

    insert = async (values) => await this.useInvoke({
        invokeType: this.invokeTypes.USE_INSERT,
        invokeValue: {
            params: {
                table: this.tableName,
                values,
            }
        },
    })

    find = async ({ w = null, custom_query = null }) => await this.useInvoke({
        invokeType: this.invokeTypes.USE_SELECT,
        invokeValue: {
            params: {
                table: this.tableName,
                w,
                custom_query
            }
        }
    })

    update = async ({ w, values }) => await this.useInvoke({
        invokeType: this.invokeTypes.USE_UPDATE,
        invokeValue: {
            params: {
                w,
                table: this.tableName,
                values
            }
        },
    })

    exists = async (w) => await this.useInvoke({
        invokeType: this.invokeTypes.EXISTS,
        invokeValue: {
            table: this.tableName,
            w
        },
    })

    delete = async (w) => await this.useInvoke({
        invokeType: this.invokeTypes.USE_DELETE,
        invokeValue: {
            params: {
                table: this.tableName,
                w
            }
        }
    })
}

//     _useWhere(where, initCharacter = "=") {
//         let whereString = ""
//         let firstCycle = false
//         for (const expressionOfComparison in where) {
//             const contextObject = where[expressionOfComparison]
//             if (expressionOfComparison === "and") {
//                 whereString += this.#iterateAndSetKeyword({
//                     keyword: "AND",
//                     addKeywordBehind: firstCycle,
//                     character: initCharacter
//                 }, contextObject) + " "
//             }
//             else if (expressionOfComparison === "or") {
//                 whereString += this.#iterateAndSetKeyword({
//                     keyword: "OR",
//                     addKeywordBehind: firstCycle,
//                     character: initCharacter
//                 }, contextObject) + " "
//             }
//             else if (expressionOfComparison === "different") {
//                 // whereString += this.#iterateAndSetKeyword({
//                 //     character: "!=",
//                 // }, contextObject) + " "
//                 whereString += this.#removeLastWord(this._useWhere(contextObject, "!=").trim()) + " "
//             }
//             else {
//                 whereString += `${expressionOfComparison} = ${contextObject} `
//             }
//
//             if (!firstCycle) firstCycle = true
//         }
//
//         return this.#removeLastWord(whereString.replace(/\s+/g, " "))
//     }
//
//     async _useInvoke({ invokeType, invokeValue, contextType }) {
//         if (!("__TAURI__" in window)) return null
//
//         const { invoke } = window.__TAURI__
//
//         return await invoke(invokeType, {
//             values: invokeValue
//         })
//             .then(result => {
//                 this.context.current = {
//                     ...this.context.current,
//                     contextType,
//                     contextValue: result
//                 }
//                 return result
//             })
//             .catch(err => console.log("Error: " + err.message))
//     }
//
//     async find({ where = null }) {
//         const whereString = where !== null ? " WHERE " + this._useWhere(where) : ""
//         const values = [
//             "*",
//             this.tableName,
//             whereString,
//             this.tableName
//         ]
//
//         const result = await this._useInvoke({
//             invokeType: "select",
//             invokeValue: [values],
//             contextType: "select"
//         })
//
//         return result
//     }
//
//     async insert(data) {
//
//         const values = [
//             true,
//             this.tableName,
//             Object.keys(data).join(", "),
//             Object.values(data).map(value => `'${value}'`).join(", ")
//         ]
//
//         await this._useInvoke("insert", [values])
//     }
//
//     async update({ values, where }) {
//
//         return await this._useInvoke({
//             contextType: "update",
//             invokeType: "update",
//             invokeValue: [
//                 this.tableName,
//                 this._setObjToString(values),
//                 this._useWhere(where)
//             ]
//         })
//     }
//
//     async updateAndGet({
//         values,
//         where,
//         getBy,
//         id
//     }) {
//
//         let obj = {
//             hasError: true,
//             data: null
//         }
//
//         const isUpdated = await this.update({
//             values,
//             where
//         })
//
//         if (isUpdated) {
//             const [updatedValue] = await this.find({
//                 where: {
//                     [getBy]: id
//                 }
//             })
//
//             obj = {
//                 data: updatedValue,
//                 hasError: false
//             }
//         }
//
//         return obj
//     }
//
//     _setObjToString(obj) {
//         let toStr = ""
//         for (const key in obj) {
//             toStr += `${key} = '${obj[key]}', `
//         }
//
//         return toStr.slice(0, -2)
//     }
//
//     #iterateAndSetKeyword({
//         keyword = null,
//         character = null,
//         addKeywordBehind = false
//     }, object) {
//         let returnValue = ""
//         for (const key in object) {
//             // if (["and", "or"].includes(key)) continue
//             returnValue += `${addKeywordBehind && keyword ? keyword + " " || "" : ""}${key} ${character || "="}
//             ${object[key]} ${!addKeywordBehind && keyword ? keyword || "" : ""} `
//         }
//
//         return returnValue.replace(/\s+/g, " ")
//     }
//
//     #removeLastWord = (inputString) => String(inputString).replace(/\s+\w+$/, '')
