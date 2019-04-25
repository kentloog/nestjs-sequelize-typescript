const sql = `
    create extension if not exists "uuid-ossp";

    insert into public."user"(
        "id",
        "email", 
        "password", 
        "first_name", 
        "last_name", 
        "gender",
        "birthday", 
        "created_at",
        "updated_at", 
        "deleted_at"
    ) values (
        uuid_generate_v4(),
        'kentloog@gmail.com', 
        '$2b$10$9KwTyNlFcEW.Ewtv0s3XRO8YazWojM48qBuED0lMuigsoEIyIXDOO', 
        'Kent', 
        'Loog', 
        'male',
        '1996-08-01', 
        'now()', 
        'now()', 
        null
    );
`;

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(sql),
    down: () => {},
};
