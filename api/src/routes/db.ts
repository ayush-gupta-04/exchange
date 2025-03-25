import {Router} from 'express'
import { pgClient } from '..';
export const dbRouter = Router();

dbRouter.post('/initialise',async (req,res) => {
    const asset_query = `
        CREATE TABLE IF NOT EXISTS crypto_assets (
            symbol        TEXT    NOT NULL PRIMARY KEY,
            name          TEXT    NOT NULL,
            created_at    TIMESTAMPTZ
        );
    `
    const user_query = `CREATE TABLE IF NOT EXISTS crypto_users (
        user_id        SERIAL PRIMARY KEY,
        first_name     TEXT NOT NULL,
        last_name      TEXT,
        email          TEXT  NOT NULL UNIQUE,
        password       TEXT NOT NULL 
    )`

    const order_query = `
        CREATE TYPE status AS ENUM ('new', 'filled', 'partially_filled','cancelled');

        CREATE TABLE  IF NOT EXISTS crypto_orders (
            order_id         TEXT   PRIMARY KEY,
            symbol           TEXT  NOT NULL,
            user_id          INT   NOT NULL,
            price            DOUBLE PRECISION NOT NULL,
            qty             DOUBLE PRECISION NOT NULL,
            quote_qty       DOUBLE PRECISION NOT NULL,
            filled          DOUBLE PRECISION NOT NULL,
            status          status,
            time            TIMESTAMPTZ,
            side            SIDE,
            FOREIGN KEY (user_id) REFERENCES crypto_users(user_id),
            FOREIGN KEY (symbol) REFERENCES crypto_assets(symbol)
        )
    `

    const trade_query = `
        CREATE TABLE IF NOT EXISTS crypto_trades (
            trade_id           INT NOT NULL,
            symbol             TEXT NOT NULL,
            time               TIMESTAMPTZ NOT NULL,
            price              DOUBLE PRECISION NOT NULL,
            qty                DOUBLE PRECISION NOT NULL,
            is_buyer_maker     BOOLEAN,
            seller_id          INT NOT NULL,
            buyer_id           INT NOT NULL,
            PRIMARY KEY (trade_id,symbol,time),
            FOREIGN KEY (seller_id) REFERENCES crypto_users(user_id),
            FOREIGN KEY (buyer_id) REFERENCES crypto_users(user_id)
        );
        
        SELECT create_hypertable('crypto_trades',by_range('time'))
    `

    try {
        await pgClient.query("BEGIN")
        await pgClient.query(asset_query);
        await pgClient.query(user_query);
        await pgClient.query(order_query);
        await pgClient.query(trade_query);
        await pgClient.query(asset_query);
        await pgClient.query("COMMIT")
        res.json({
            success : true,
            message : "Database initialised successfully !"
        })
    } catch (error) {
        console.log(error)
        await pgClient.query("ROLLBACK");
        res.json({
            success : false,
            error : "Rolled back to initial state !"
        })
    }
})