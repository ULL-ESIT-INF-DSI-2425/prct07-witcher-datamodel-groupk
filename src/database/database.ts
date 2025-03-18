import { Low } from "lowdb";
import { JSONFile } from "lowdb/node"
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import * as MyGoods from "../database/assets.js";
import * as MyMerchants from "../database/merchants.js";
import * as MyClients from "../database/clients.js";

type Data = {
    assets: Assets[],
    merchants: Merchant[],
    clients: Clients[]
};

const defaultData: Data = { 
    assets: [ MyGoods.asset1, MyGoods.asset2, MyGoods.asset3, MyGoods.asset4, MyGoods.asset5,
              MyGoods.asset6, MyGoods.asset7, MyGoods.asset8, MyGoods.asset9, MyGoods.asset10,
              MyGoods.asset11, MyGoods.asset12, MyGoods.asset13, MyGoods.asset14, MyGoods.asset15,
              MyGoods.asset16, MyGoods.asset17, MyGoods.asset18, MyGoods.asset19, MyGoods.asset20 ], 

    merchants: [ MyMerchants.merchant1, MyMerchants.merchant2, MyMerchants.merchant3, MyMerchants.merchant4, MyMerchants.merchant5, 
                MyMerchants.merchant6, MyMerchants.merchant7, MyMerchants.merchant8, MyMerchants.merchant9, MyMerchants.merchant10 ], 

    clients: [ MyClients.client1, MyClients.client2, MyClients.client3, MyClients.client4, MyClients.client5, 
               MyClients.client6, MyClients.client7, MyClients.client8, MyClients.client9, MyClients.client10 ]
};

export let db = new Low<Data>(new JSONFile('db.json'), defaultData);

