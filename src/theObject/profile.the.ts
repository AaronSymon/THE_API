import {TheObject} from "../types";

export const profile: TheObject = {
    entity: {
        entityName: "profile",
        columns: [
            {
                name: "gender",
                type: "string",
                options: {
                    nullable: false,
                    columnType: "varchar",
                }
            },
            {
                name: "photo",
                type: "string",
                options: {
                    nullable: false,
                    columnType: "varchar",
                }
            },
        ],
        relations: [
            {
                name: "user",
                type: "OneToOne",
                relationWith: "user",
            }
        ],
        dtoExcludedColumns: ["gender"]
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
            getAccessRelations: ["user"],
        }
    ],
}