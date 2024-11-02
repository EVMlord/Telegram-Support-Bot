import { Api, Context } from "grammy";

import { I18nFlavor } from "@grammyjs/i18n";

import { Messages } from "./database/models/messages";
import { Blacklist } from "./database/models/blacklist";

interface MyDb {
  db: {
    Messages: typeof Messages;
    Blacklist: typeof Blacklist;
  };
}

type MyContext = Context & I18nFlavor & MyDb;
type MyApi = Api;

export { MyContext, MyApi };
