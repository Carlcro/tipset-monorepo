import { Team } from "../types/team";

class TeamBuilder {
  private _id: string;
  private name: string;
  private group: string;

  constructor() {
    this._id = "1";
    this.name = "Spain";
    this.group = "A";
  }

  withId(id: string) {
    this._id = id;
    return this;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }
  withGroup(group: string) {
    this.group = group;
    return this;
  }

  build(): Team {
    return {
      _id: this._id,
      name: this.name,
      group: this.group,
    };
  }
}

export default TeamBuilder;
