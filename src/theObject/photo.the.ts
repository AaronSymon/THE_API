import {TheObject} from "../types";

export const photo: TheObject = {
    entity: {
        entityName: "photo",
        columns: [
            {
                name: "url",
                type: "string",
                options: {
                    nullable: false,
                    unique: false,
                    columnType: "varchar"
                },
            }
        ],
        relations: [
            {
                name: "user",
                type: "ManyToOne",
                relationWith: "user",
                oneToManyJoinTable: "photos"
            }
        ],
    },
    cache: {
        isEntityCached: false,
    },
    access: [
        {
            userRole: "User",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id"],
            getAccessRelations: ["user"],
        },
        {
            userRole: "Admin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id"],
            getAccessRelations: ["user"],
        },
        {
            userRole: "SuperAdmin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id"],
        }
    ],
}