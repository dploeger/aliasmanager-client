import { store } from '@/stores/RootStore';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'Account' })
export class Account extends VuexModule {
  public token: string | null = null;
  public username: string | null = null;

  @Mutation
  public setToken(token: string) {
    this.token = token;
  }

  @Mutation
  public setUsername(username: string) {
    this.username = username;
  }

  @Action
  public updateToken(token: string) {
    this.context.commit('setToken', token);
  }

  @Action
  public resetToken() {
    this.context.commit('setToken', null);
  }

  @Action
  public updateUsername(username: string) {
    this.context.commit('setUsername', username);
  }
}
