type entityCache = {
    entity: Function,
    isEntityCached: boolean
}

type entityAccess = {
        userRole: string,
        accessMethods: Set<string>,
        getAccessParams: Array<string>
}

type userPayload = {
    id: number,
    email: string,
    role: string,
    userAgent: string
    ipAdress: string
}

type personalizedController = {
    controllerName: string,
    controllerParams: {paramName: string, paramType: string, paramRegex: string,}[],
    controller: Function
}

type TheObject = {
    entity: Entity,
    cache?: EntityCache
    access?: EntityAccess,
}

type Entity = {
    entityName: string,
    columns: Column[],
    relations: Relation[],
    dtoExcludedColumns: string[],
}

type EntityCache = {
    isEntityCached: boolean,
}

type EntityAccess = {
    httpMethods: Set<"GET" | "POST" | "PUT" | "DELETE">,
    getAccessParams?: string[],
    getAccessRelations?: string[],
}

type Column = {
    name: string,
    type: "string" | "number" | "Date" | "boolean" | "Blob"
    options: {
        ColumnOptions : ColumnOptions
    }
}

type ColumnOptions = {
    nullable: boolean,
    unique: boolean,
    type: ColumnType,
}

type Relation = {
    name: string,
    RelationWith: Entity,
    type: "OneToOne" | "OneToMany" | "ManyToOne" | "ManyToMany",
}

//TypeORM Type
 type WithPrecisionColumnType = "float" | "double" | "dec" | "decimal" | "smalldecimal" | "fixed" | "numeric" | "real" | "double precision" | "number" | "datetime" | "datetime2" | "datetimeoffset" | "time" | "time with time zone" | "time without time zone" | "timestamp" | "timestamp without time zone" | "timestamp with time zone" | "timestamp with local time zone";
 type WithLengthColumnType = "character varying" | "varying character" | "char varying" | "nvarchar" | "national varchar" | "character" | "native character" | "varchar" | "char" | "nchar" | "national char" | "varchar2" | "nvarchar2" | "alphanum" | "shorttext" | "raw" | "binary" | "varbinary" | "string";
 type WithWidthColumnType = "tinyint" | "smallint" | "mediumint" | "int" | "bigint";
 type SimpleColumnType = "simple-array" | "simple-json" | "simple-enum" | "int2" | "integer" | "int4" | "int8" | "int64" | "unsigned big int" | "float" | "float4" | "float8" | "float64" | "smallmoney" | "money" | "boolean" | "bool" | "tinyblob" | "tinytext" | "mediumblob" | "mediumtext" | "blob" | "text" | "ntext" | "citext" | "hstore" | "longblob" | "longtext" | "alphanum" | "shorttext" | "bytes" | "bytea" | "long" | "raw" | "long raw" | "bfile" | "clob" | "nclob" | "image" | "timetz" | "timestamptz" | "timestamp with local time zone" | "smalldatetime" | "date" | "interval year to month" | "interval day to second" | "interval" | "year" | "seconddate" | "point" | "line" | "lseg" | "box" | "circle" | "path" | "polygon" | "geography" | "geometry" | "linestring" | "multipoint" | "multilinestring" | "multipolygon" | "geometrycollection" | "st_geometry" | "st_point" | "int4range" | "int8range" | "numrange" | "tsrange" | "tstzrange" | "daterange" | "enum" | "set" | "cidr" | "inet" | "inet4" | "inet6" | "macaddr" | "bit" | "bit varying" | "varbit" | "tsvector" | "tsquery" | "uuid" | "xml" | "json" | "jsonb" | "varbinary" | "hierarchyid" | "sql_variant" | "rowid" | "urowid" | "uniqueidentifier" | "rowversion" | "array" | "cube" | "ltree";
 type ColumnType = WithPrecisionColumnType | WithLengthColumnType | WithWidthColumnType | SimpleColumnType
