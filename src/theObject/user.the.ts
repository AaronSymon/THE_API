import {TheObject} from "../types";

export const user: TheObject = {
    entity: {
        entityName: "user",
        columns: [
            {
                name: "role",
                type: "string",
                options: {
                    nullable: false,
                    unique: false,
                    columnType: "varchar",
                    default: "User"
                }
            },
            {
                name: "email",
                type: "string",
                options: {
                    nullable: false,
                    unique: true,
                    columnType: "varchar"
                }
            },
            {
                name: "password",
                type: "string",
                options: {
                    nullable: false,
                    unique: false,
                    columnType: "varchar"
                }
            },
            {
                name: "nom",
                type: "string",
                options: {
                    nullable: false,
                    unique: false,
                    columnType: "varchar"
                }
            },
            {
                name: "prenom",
                type: "string",
                options: {
                    nullable: false,
                    unique: false,
                    columnType: "varchar"
                }
            }
        ],
        relations: [
            {
                name: "profile",
                type: "OneToOne",
                relationWith: "profile"
            },
            {
                name: "photos",
                type: "OneToMany",
                relationWith: "photo"
            },
        ],
        dtoExcludedColumns: ["role", "password"],
        dtoExcludedRelations: []
    },
    cache: {
        isEntityCached: false,
    },
    access: [
        {
            userRole: "User",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id", "email"],
            getAccessRelations: ["profile", "photos"]
        },
        {
            userRole: "Admin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id"],
            getAccessRelations: ["profile", "photos"]
        },
        {
            userRole: "SuperAdmin",
            httpMethods: new Set(["GET", "POST", "PUT", "DELETE"]),
            getAccessParams: ["id"],
            getAccessRelations: ["profile", "photos"]
        }
    ]
}