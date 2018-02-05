/**
 * Base class for model implementation
 */
export abstract class Model {

  /**
   * Converter of backend data to model format by aliases
   *
   * @param value data from backend
   * @public
   */
  public _fromJSON(value) {
    this.constructor['_alias']
      .forEach(
        item => {
          const newValue = value[item['value']];

          if (item['type']) {
            if (Array.isArray(newValue)) {
              this[item['key']] = newValue.map(x => this._createObject(item, x));
            } else if (this._isObject(newValue)) {
              this[item['key']] = this._createObject(item, newValue);
            }
          } else {
            this[item['key']] = value[item['value']];
          }
        }
      );
  }

  /**
   * Converter of model format to backend data by aliases
   *
   * @return new object
   * @public
   */
  public _toJSON() {
    const obj = {};

    this.constructor['_alias']
      .forEach(
        item => {
          const value = this[item['key']];

          if (item['type']) {
            if (Array.isArray(value)) {
              obj[item['value']] = value.map(x => x._toJSON());
            } else if (this._isObject(value)) {
              obj[item['value']] = value._toJSON();
            }
          } else {
            obj[item['value']] = this[item['key']];
          }
        }
      );
    return obj;
  }

  private _createObject(item, obj): Object {
    const newObj = new item['type']();
    newObj._fromJSON(obj);
    return newObj;
  }

  private _isObject(item): boolean {
    return Object.prototype.toString.call(item) === '[object Object]';
  }
}

/**
 * @deprecated Use the `AppModel` instead. Will be remove in version 1.0.0
 */
export const ApplicationModel = Model;

/**
 * @deprecated Use the `AppModel` instead. Will be remove in version 1.0.0
 */
export const AppModel = Model;
