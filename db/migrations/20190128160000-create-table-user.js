const sql = `

    do $$
    begin
        if not exists (
            select 
                t.typname enum_name
            from 
                pg_type t join 
                pg_enum e on t.oid = e.enumtypid join
                pg_catalog.pg_namespace n on n.oid = t.typnamespace 
            where 
                n.nspname = 'public' and 
                t.typname='enum_user_gender' 
            group by 1
        ) then
            create type "public"."enum_user_gender" as enum('female', 'male');
        end if;
    end
    $$;

    create table "user" (
        "id" uuid, 
        "email" varchar(255) unique, 
        "password" varchar(255), 
        "first_name" varchar(255), 
        "last_name" varchar(255), 
        "gender" "public"."enum_user_gender", 
        "birthday" date, 
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
