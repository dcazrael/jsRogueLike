import { Component } from 'geotic';
export class Slot extends Component {
  static properties = { name: '' };
}

export class EquipmentEffect extends Component {
  static allowMultiple = true;
  static properties = {
    component: '',
    delta: '',
  };
}

export class EquipmentSlot extends Component {
  static allowMultiple = true;
  static keyProperty = 'name';

  static properties = {
    name: '',
    itemId: this.itemId,
  };

  get item() {
    return this.world.getEntity(this.itemId);
  }

  set item(entity) {
    return (this.itemId = entity.id);
  }

  onEquip(evt) {
    if (!evt.data.equipmentEffect) return;
    evt.data.equipmentEffect.forEach((effect) => {
      if (effect.component === 'health') {
        this.entity[effect.component].base += effect.delta;
      }
      this.entity[effect.component].current += effect.delta;
    });
    evt.handle();
  }

  onUnequip(evt) {
    if (!evt.data.equipmentEffect) return;
    evt.data.equipmentEffect.forEach((effect) => {
      if (effect.component === 'health') {
        this.entity[effect.component].base -= effect.delta;
      }
      this.entity[effect.component].current -= effect.delta;
    });
    evt.handle();
  }
}
