import {platformBrowser} from "@angular/platform-browser";
import {AppModuleNgFactory} from "./app/app.module.ngfactory";
import "./styles.less"


platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
  .catch(err => console.log(err));
