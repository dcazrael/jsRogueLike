import { addLog } from '..';
import { EquipmentSlot, IsEquipped } from '../state/components';
import world from '../state/ecs';

export const equipItem = (entity, player) => {
  if (player.equipmentSlot?.[entity.slot.name]) {
    const previousEquipped = world.getEntity(
      player.equipmentSlot?.[entity.slot.name].itemId
    );
    previousEquipped.remove(previousEquipped.isEquipped);

    player.fireEvent('unequip', previousEquipped);
    player.remove(player.equipmentSlot[previousEquipped.slot.name]);
    addLog(`You unequip ${previousEquipped.description.name}`);
  }
  player.add(EquipmentSlot, {
    name: entity.slot.name,
    itemId: entity.id,
  });

  entity.add(IsEquipped);

  player.fireEvent('equip', entity);
  addLog(`You equip ${entity.description.name}`);
};

export const unequipItem = (entity, player) => {
  entity.remove(entity.isEquipped);

  player.fireEvent('unequip', entity);
  player.equipmentSlot[entity.slot.name].destroy();
  addLog(`You unequip ${entity.description.name}`);
};
