declare module 'pinia' {
  export interface PiniaCustomProperties {
    // Extend Pinia store with custom properties here
  }

  export interface DefineStoreOptionsBase<S, Store> {
    // Add any custom store option types here
  }

  export interface PiniaCustomStateProperties<S> {
    // Add custom state properties here
  }

  export function createPinia(): any
  export function defineStore<Id extends string, S extends StateTree = {}, G = {}, A = {}>(
    id: Id,
    options: DefineStoreOptions<Id, S, G, A>
  ): StoreDefinition<Id, S, G, A>

  export interface StateTree {
    [key: string]: any
  }

  export interface StoreDefinition<Id extends string, S extends StateTree = {}, G = {}, A = {}> {
    (): Store<Id, S, G, A>
    $id: Id
  }

  export interface DefineStoreOptions<Id extends string, S extends StateTree = {}, G = {}, A = {}> {
    id?: Id
    state?: () => S
    getters?: G & ThisType<Store<Id, S, G, A>>
    actions?: A & ThisType<Store<Id, S, G, A>>
  }

  export interface Store<Id extends string, S extends StateTree = {}, G = {}, A = {}> {
    readonly $id: Id
    $state: S
    $patch(partialState: Partial<S>): void
    $reset(): void
    $subscribe(callback: SubscriptionCallback<S>, options?: { detached?: boolean }): () => void
    $onAction(callback: ActionSubscriptionCallback, detached?: boolean): () => void
  }

  export interface SubscriptionCallback<S> {
    (mutation: { type: string; payload: any }, state: S): void
  }

  export interface ActionSubscriptionCallback {
    (context: {
      store: Store<string>
      name: string
      args: unknown[]
      after?: (result: unknown) => void
      onError?: (error: unknown) => void
    }): void
  }
}

export {}
