export type entityCache = {
    entity: Function,
    isEntityCached: boolean
}

export type entityAccess = {
        userRole: string,
        accessMethods: Set<string>,
        getAccessParams: Array<string>
        getAccessRelations: Array<string>
}

export type userPayload = {
    id: number,
    email: string,
    role: string,
    userAgent: string
    ipAdress: string
}

export type personalizedController = {
    controllerName: string,
    controllerParams: {paramName: string, paramType: string, paramRegex: string,}[],
    controller: Function
}

export type TheObject = {
    entity: TheEntity,
    cache?: TheEntityCache
    access?: TheEntityAccess[],
}

export type TheEntity = {
    entityName: string,
    columns?: TheColumn[],
    relations: TheRelation[],
    dtoExcludedColumns?: TheColumn["name"][] ,
    dtoExcludedRelations?: TheRelation["name"][],
}

export type TheEntityCache = {
    isEntityCached: boolean,
}

export type TheEntityAccess = {
    userRole: undefined |"User" | "Admin" | "SuperAdmin",
    httpMethods: Set<"GET" | "POST" | "PUT" | "DELETE">,
    getAccessParams?: string[],
    getAccessRelations?: string[],
}


export type TheColumn = {
    name: string,
    type: "string" | "number" | "Date" | "boolean" | "Blob"
    options: {
        nullable: boolean,
        unique?: boolean,
        columnType: ColumnType,
        default?: string | number | boolean | Date | null,
    }
}

export type TheRelation = {
    name: string,
    type: "OneToOne" | "OneToMany" | "ManyToOne" | "ManyToMany",
    relationWith: string,
    cascade?: boolean | ("insert" | "update" | "remove" | "soft-remove" | "recover")[],
    oneToOneOwningSide?: boolean,
    manyToManyOwningSide?: boolean,
    oneToManyJoinTable?: string,
    manyToManyJoinTable?: string
}

//TypeORM Type
 type WithPrecisionColumnType = "float" | "double" | "dec" | "decimal" | "smalldecimal" | "fixed" | "numeric" | "real" | "double precision" | "number" | "datetime" | "datetime2" | "datetimeoffset" | "time" | "time with time zone" | "time without time zone" | "timestamp" | "timestamp without time zone" | "timestamp with time zone" | "timestamp with local time zone";
 type WithLengthColumnType = "character varying" | "varying character" | "char varying" | "nvarchar" | "national varchar" | "character" | "native character" | "varchar" | "char" | "nchar" | "national char" | "varchar2" | "nvarchar2" | "alphanum" | "shorttext" | "raw" | "binary" | "varbinary" | "string";
 type WithWidthColumnType = "tinyint" | "smallint" | "mediumint" | "int" | "bigint";
 type SimpleColumnType = "simple-array" | "simple-json" | "simple-enum" | "int2" | "integer" | "int4" | "int8" | "int64" | "unsigned big int" | "float" | "float4" | "float8" | "float64" | "smallmoney" | "money" | "boolean" | "bool" | "tinyblob" | "tinytext" | "mediumblob" | "mediumtext" | "blob" | "text" | "ntext" | "citext" | "hstore" | "longblob" | "longtext" | "alphanum" | "shorttext" | "bytes" | "bytea" | "long" | "raw" | "long raw" | "bfile" | "clob" | "nclob" | "image" | "timetz" | "timestamptz" | "timestamp with local time zone" | "smalldatetime" | "date" | "interval year to month" | "interval day to second" | "interval" | "year" | "seconddate" | "point" | "line" | "lseg" | "box" | "circle" | "path" | "polygon" | "geography" | "geometry" | "linestring" | "multipoint" | "multilinestring" | "multipolygon" | "geometrycollection" | "st_geometry" | "st_point" | "int4range" | "int8range" | "numrange" | "tsrange" | "tstzrange" | "daterange" | "enum" | "set" | "cidr" | "inet" | "inet4" | "inet6" | "macaddr" | "bit" | "bit varying" | "varbit" | "tsvector" | "tsquery" | "uuid" | "xml" | "json" | "jsonb" | "varbinary" | "hierarchyid" | "sql_variant" | "rowid" | "urowid" | "uniqueidentifier" | "rowversion" | "array" | "cube" | "ltree";
 export type ColumnType = WithPrecisionColumnType | WithLengthColumnType | WithWidthColumnType | SimpleColumnType
