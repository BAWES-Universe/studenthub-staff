import { NgModule } from '@angular/core';
import { EnvConfig } from './environments.token';

// List of Environment Configs
import { environmentList } from './environments.config';

declare const process: any; // Typescript compiler will complain without this

export function environmentFactory() {
  let loadEnvironment;

  // Loop through available configured environments
  // If the environment is available in NODE_ENV then load it, otherwise load the last env in the list.
  for(var i = 0; i < environmentList.length; i++){
    loadEnvironment = environmentList[i];
    if(environmentList[i].envName == process.env.NODE_ENV) break;
  }
  return loadEnvironment;
}

@NgModule({
  providers: [
    {
      provide: EnvConfig,
      // useFactory instead of useValue so we can easily add more logic as needed.
      useFactory: environmentFactory
    }
  ]
})
export class EnvironmentsModule {}