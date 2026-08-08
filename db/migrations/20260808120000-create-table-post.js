const sql = `

    create table "post" (
        "id" bigserial,
        "user_id" uuid references "user" ("id"),
        "title" varchar(255),
        "content" varchar(255),
        "created_at" timestamp with time zone,
        "updated_at" timestamp with time zone,
        "deleted_at" timestamp with time zone,
        primary key ("id")
    );

`;

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(sql),
    down: () => {},
};
