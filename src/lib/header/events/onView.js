import { setUrl } from "../../../../../helpers/navigation.js"

const onView = ({ payload }) => {
  const currentLocation = setUrl(location.pathname, false)
  const desireLocation = setUrl(payload?.go)

  if (desireLocation === currentLocation) {
    return
  }

  window.location.href = desireLocation.toString()
}

export default onView