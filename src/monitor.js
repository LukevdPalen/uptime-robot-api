import _ from 'lodash';

const PREFIX = 'monitor'

class Monitor{

  constructor(options){
        this.id = options.id,
        this.friendlyName = options.friendlyname,
        this.URL= options.url,
        this.type= options.type || '1',
        this.subType= options.subtype,
        this.keywordType= options.keywordtype,
        this.keywordValue= options.keywordvalue,
        this.HTTPUsername= options.httpusername,
        this.HTTPPassword= options.httppassword,
        this.log = (options.log || []),
        this.alertContacts= this.contacts,
        this.interval= options.interval


        this._contacts = [];
  }

  static get singular(){
    return PREFIX;
  }

  static get plural(){
    return `${PREFIX}s`;
  }

  set contact(contact){

    this._contacts.push(contact);
  }

  get contacts(){
      return _.map(this._contacts, (contact) => {
        return contact.toString();
    }).join('-');
  }

  validate(){
    if (!_.has(this, 'friendlyName')) return Error('`monitorFriendlyName` not defined');
    if (!_.has(this, 'URL'))  return  Error('`monitorURL` not defined');

    return true
  }

  parse(){
    var keys = _.keys(this)
    return _.chain(keys)
            .map(key => {

              if(key == 'log' || key.charAt(0) == '_') return;

              return [PREFIX + key.charAt(0).toUpperCase() + key.slice(1), this[key]];
            })
            .object()
            .value();
  }
}

export default Monitor
