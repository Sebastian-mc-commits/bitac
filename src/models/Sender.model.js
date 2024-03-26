import tableTypes from "../types/db/tables.types.js"
import Global from "./Global.js"

export default class extends Global {

    constructor() {
        super(tableTypes.SENDER)
    }

    obtainSenderDetails = async (w = null) => await this.useInvoke({
        invokeType: this.invokeTypes.OBTAIN_SENDER_DETAILS,
        invokeValue: w
    })

    updateFavorite = async (id) => {
        const [isUpdated, [data]] = await Promise.all([
            this.useInvoke({
                invokeType: this.invokeTypes.SET_FAVORITE,
                contextType: "setFavorite",
                invokeValue: {
                    w: {
                        continue: {
                            nit: id
                        }
                    }
                }
            }),

            this.find({
                w: {
                    continue: {
                        nit: id
                    }
                }
            })
        ])

        return {
            isUpdated,
            data
        }
    }
}