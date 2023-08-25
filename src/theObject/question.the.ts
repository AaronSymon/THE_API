import {TheObject} from "../types";

export const question: TheObject = {
    entity: {
        entityName: "question",
        columns: [
            {
                name: "title",
                type: "string",
                options: {
                    nullable: false,
                    unique: false,
                    columnType: "varchar",
                }
            },
            {
                name: "text",
                type: "string",
                options: {
                    nullable: false,
                    unique: false,
                    columnType: "varchar",
                }
            }
        ],
        relations: [
            {
                name: "categories",
                type: "ManyToMany",
                relationWith: "category",
                manyToManyOwningSide: true,
                manyToManyJoinTable: "questions"
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
            getAccessRelations: ["categories"],
        },
        {
            userRole: "Admin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id"],
            getAccessRelations: ["categories"],
        },
        {
            userRole: "SuperAdmin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id"],
            getAccessRelations: ["categories"],
        }
    ],
}