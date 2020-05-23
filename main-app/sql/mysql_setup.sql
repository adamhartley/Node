/*
 * Scripts to create the MySql database for 'manual' setup.
 * No need to run the create table statements if using an ORM (Sequelize)
 */
CREATE DATABASE node_webapp;

CREATE USER 'node_user'@'localhost' IDENTIFIED BY 'node_user';
GRANT ALL ON *.* to 'node_user'@'%' IDENTIFIED BY 'node_user'; # TODO: restrict user privileges

CREATE TABLE IF NOT EXISTS node_webapp.Products
(
    id          bigint(18) UNSIGNED NOT NULL AUTO_INCREMENT,
    title       VARCHAR(255)        NOT NULL,
    price       DOUBLE              NOT NULL,
    description TEXT                NOT NULL,
    image_url   TEXT                NOT NULL,
    PRIMARY KEY (id)
) COMMENT ='Node web store products';

# create dummy record for testing
INSERT INTO node_webapp.Products(title, price, description, image_url)
VALUES ('dummy title', 12.34, 'dummy description', 'dummy url');