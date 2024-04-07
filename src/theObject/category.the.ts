import {TheObject} from "../types";

export const category: TheObject = {
    entity: {
        entityName: "category",
        columns: [
            {
                name: "name",
                type: "string",
                options: {
                    nullable: false,
                    unique: true,
                    columnType: "varchar"
                }
            },
        ],
        relations: [
            {
                name: "questions",
                type: "ManyToMany",
                relationWith: "question",
                manyToManyJoinTable: "categories"
            },
        ],

    },
    cache: {
        isEntityCached: false,
    },
    access: [
        {
            userRole: undefined,
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id", "name"],
            getAccessRelations: ["questions"]
        },
        {
            userRole: "User",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id", "name"],
        },
        {
            userRole: "Admin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id", "name"],
        },
        {
            userRole: "SuperAdmin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id", "name"],
        }
    ],
}