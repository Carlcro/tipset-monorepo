import { Team } from "../types/team";

class TeamBuilder {
  private id: string;
  private name: string;
  private group: string;

  constructor() {
    this.id = "1";
    this.name = "Spain";
    this.group = "A";
  }

  withId(id: string) {
    this.id = id;
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
      id: this.id,
      name: this.name,
      group: this.group,
    };
  }
}

export default TeamBuilder;
