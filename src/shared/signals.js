/**
 * This module provides a way to create signals and subscribe to them.
 * Signals are objects that hold a value and updates the subscribers when the value changes.
 * 
 * It is useful for creating reactive components.
 * 
 * Basic usage:
 * 
 * ```javascript
 *  const signal = createSignal("Hello");
 *  createEffect(signal, (value) => {
 *    // React to the value change with some UI update
 *    document.getElementById('some-element').textContent = value;
 *  })
 *  
 *  // Set a new value for the signal. This will trigger the effect, updating the UI element
 *  // The signal state is immutable, so we update the signal with a new instance of the value
 *  signal.set("Hello");
 * 
 *  // Update the signal by using the previous value
 *  signal.update((value) => value + "World !");
 *  
 *  // Get the current value of the signal 
 *  signal.get(); // "Hellow World!"
 * ```
 * 
 * Author: Yvan Guekeng Tindo
 */


class Signal {
  constructor(initialValue) {
    this.subscribers = [];
    this.state = new Proxy({ value: initialValue }, this.notify());
  }

  /**
   * This is a handler for the Proxy object
   * When the state changes it notifies the subscribers 
   * It calls the update method of each subscriber with the new value
   * @returns {ProxyHandler}
   */
  notify() {
    const handler = {
      set(target, prop, newValue) {
        const outcome = Reflect.set(...arguments);
        if (outcome)
          this.subscribers.forEach((subscriber) => subscriber.update(newValue));
        return outcome;
      },
      get(target, prop, receiver) {
        return Reflect.get(...arguments);
      },
    };

    const bindedSet = handler.set.bind(this);

    return {
      ...handler,
      set: bindedSet,
    };
  }

  get() {
    return this.state.value;
  }

  set(value) {
    this.state.value = value;
  }


  /**
   * @callback Updater
   * @param {any} value
   */

  /**
   * @param {Updater} updater 
   */
  update(updater) {
    this.state.value = updater(this.state.value);
  }

  /**
   * Add a subscriber to the signal.
   * @param {*} subscriber 
   * @returns 
   */
  subscribe(subscriber) {
    const isSubscribed = this.subscribers.find((sub) => sub === subscriber);

    // It does not subscribe if there is a subscribtion
    if (isSubscribed) return;

    this.subscribers.push(subscriber);

    // on subscribe we update the subscriber with the current value
    subscriber.update(this.get());
  }

  unsubscribe(subscriber) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }
}


class Subscriber {
  constructor(action) {
    this.action = action;
  }

  update(value) {
    this.action(value);
  }
}

export function createSignal(initialValue) {
  return new Signal(initialValue);
}

/**
 * Create an effect that listens to signal state changes then calls the action. 
 * Everytime the state of the signal changes the action is performed with the updated value.
 * 
 * @param {Signal} signal
 * @param {Function} action
 * @returns {} The subscriber, attach and cancel functions
 */
export function createEffect(signal, action) {
  const subscriber = new Subscriber(action);

  const attach = () => {
    signal.subscribe(subscriber);
  };

  const cancel = () => {
    signal.unsubscribe(subscriber);
  };
  
  attach();

  return {
    subscriber,
    attach,
    cancel,
  };
}