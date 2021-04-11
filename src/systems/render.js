import throttle from 'lodash/throttle';
import { gameState, messageLog, selectedInventoryIndex, targetRange } from '..';
import {
  clearCanvas,
  drawCell,
  drawCircle,
  drawImage,
  drawRect,
  drawText,
  grid,
  pxToCell,
} from '../lib/canvas';
import { Chest, Helmet, Legs, Shield, Sword } from '../lib/equipment';
import { toLocId } from '../lib/grid';
import { readCache, readCacheSet } from '../state/cache';
import {
  Appearance,
  EquipmentEffect,
  Inventory,
  IsInFov,
  IsRevealed,
  Layer100,
  Layer300,
  Layer400,
  Position,
} from '../state/components/';
import world from '../state/ecs';

const layer100Entities = world.createQuery({
  all: [Position, Appearance, Layer100],
  any: [IsInFov, IsRevealed],
});

const layer300Entities = world.createQuery({
  all: [Position, Appearance, Layer300],
  any: [IsInFov, IsRevealed],
});

const layer400Entities = world.createQuery({
  all: [Position, Appearance, Layer400, IsInFov],
});

const clearMap = () => {
  clearCanvas(grid.map.x - 1, grid.map.y, grid.map.width + 1, grid.map.height);
};

export const renderMap = (player) => {
  clearMap();

  layer100Entities.get().forEach((entity) => {
    if (entity.position.z !== readCache('z')) return;

    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#333' });
    }
  });

  layer300Entities.get().forEach((entity) => {
    if (entity.position.z !== readCache('z')) return;

    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#333' });
    }
  });

  layer400Entities.get().forEach((entity) => {
    if (entity.position.z !== readCache('z')) return;

    if (entity.isInFov) {
      drawCell(entity);
    } else {
      drawCell(entity, { color: '#100' });
    }
  });
};

const clearPlayerHud = () => {
  clearCanvas(
    grid.playerHud.x,
    grid.playerHud.y,
    grid.playerHud.width + 1,
    grid.playerHud.height
  );
};

const renderPlayerHud = (player) => {
  clearPlayerHud();

  drawText({
    text: `${player.appearance.char} ${player.description.name}`,
    background: `${player.appearance.background}`,
    color: `${player.appearance.color}`,
    x: grid.playerHud.x,
    y: grid.playerHud.y,
  });

  const goodHealth =
    player.health.current > player.health.base / 2 ? true : false;
  drawText({
    text: `${player.health.current}/${player.health.base} HP`,
    background: 'black',
    color: `${goodHealth ? 'green' : 'red'}`,
    x: grid.playerHud.x,
    y: grid.playerHud.y + 1,
  });

  drawText({
    text: `Depth: ${Math.abs(readCache('z'))}`,
    background: 'black',
    color: '#666',
    x: grid.playerHud.x,
    y: grid.playerHud.y + 2,
  });

  drawText({
    text: `Power: ${player.power.current}`,
    background: 'black',
    color: '#DDD',
    x: grid.playerHud.x,
    y: grid.playerHud.y + 4,
  });

  drawText({
    text: `Defense: ${player.defense.current}`,
    background: 'black',
    color: '#DDD',
    x: grid.playerHud.x,
    y: grid.playerHud.y + 5,
  });
};

const clearPlayerEquipment = () => {
  clearCanvas(
    grid.playerEquipment.x,
    grid.playerEquipment.y,
    grid.playerEquipment.width + 1,
    grid.playerEquipment.height
  );
};

const renderPlayerEquipment = (player) => {
  clearPlayerEquipment();
  let equipmentSlots = [
    { head: Helmet },
    { weapon: Sword },
    { chest: Chest },
    { shield: Shield },
    { legs: Legs },
  ];

  equipmentSlots.forEach((slot) => {
    const [name, image] = Object.entries(slot)[0];
    drawImage({
      x: grid.playerEquipment[name].x,
      y: grid.playerEquipment[name].y,
      width: 3,
      height: 3,
      image: image,
      color: player.equipmentSlot?.[name] ? '#FFFFFF' : '#111111',
    });
  });
};

const clearEquipmentInfo = () => {
  clearCanvas(
    grid.equipmentInfo.x,
    grid.equipmentInfo.y,
    grid.equipmentInfo.width + 1,
    grid.equipmentInfo.height
  );
};

const renderEquipmentInfo = (item) => {
  clearEquipmentInfo();

  drawText({
    text: `${item.appearance.char} ${item.description.name}`,
    background: `${item.appearance.background}`,
    color: `#DDD`,
    x: grid.equipmentInfo.x,
    y: grid.equipmentInfo.y,
  });

  if (item.has(EquipmentEffect)) {
    item.equipmentEffect.forEach((effect, index) => {
      drawText({
        text: `${effect.component}: +${effect.delta}`,
        background: 'black',
        color: '#DDD',
        x: grid.equipmentInfo.x,
        y: grid.equipmentInfo.y + index + 1,
      });
    });
  }
};

const hoverEquipment = (x, y) => {
  let equipmentSlots = [
    { head: Helmet },
    { weapon: Sword },
    { chest: Chest },
    { shield: Shield },
    { legs: Legs },
  ];

  equipmentSlots.forEach((slot) => {
    const [name] = Object.entries(slot)[0];
    if (
      x >= grid.playerEquipment[name].x &&
      x <= grid.playerEquipment[name].x + 3 &&
      y >= grid.playerEquipment[name].y &&
      y <= grid.playerEquipment[name].y + 3
    ) {
      const query = world.createQuery({
        all: [Inventory],
      });

      let player = query.get()[0];
      if (player.equipmentSlot?.[name]) {
        const item = world.getEntity(player.equipmentSlot?.[name].itemId);
        renderEquipmentInfo(item);
      }
    }
  });
};

const clearMessageLog = () => {
  clearCanvas(
    grid.messageLog.x,
    grid.messageLog.y,
    grid.messageLog.width + 1,
    grid.messageLog.height
  );
};

const renderMessageLog = () => {
  clearMessageLog();

  drawText({
    text: messageLog[2],
    background: '#000',
    color: '#666',
    x: grid.messageLog.x,
    y: grid.messageLog.y,
  });

  drawText({
    text: messageLog[1],
    background: '#000',
    color: '#aaa',
    x: grid.messageLog.x,
    y: grid.messageLog.y + 1,
  });

  drawText({
    text: messageLog[0],
    background: '#000',
    color: '#fff',
    x: grid.messageLog.x,
    y: grid.messageLog.y + 2,
  });
};

//info bar on mouseover
const clearInfoBar = () => {
  drawText({
    text: ` `.repeat(grid.infoBar.width),
    x: grid.infoBar.x,
    y: grid.infoBar.y,
    background: 'black',
  });
};

const renderInfoBar = (mPos) => {
  clearInfoBar();

  const { x, y, z } = mPos;
  const locId = toLocId({ x, y, z });

  const esAtLoc = readCacheSet('entitiesAtLocation', locId) || [];
  const entitiesAtLoc = [...esAtLoc];

  clearInfoBar();

  if (entitiesAtLoc) {
    if (entitiesAtLoc.some((eId) => world.getEntity(eId).isRevealed)) {
      drawCell({
        appearance: {
          char: '',
          background: 'rgba(255,255,255, 0.5)',
        },
        position: { x, y, z },
      });
    }

    entitiesAtLoc
      .filter((eId) => {
        const entity = world.getEntity(eId);
        return (
          layer100Entities.matches(entity) ||
          layer300Entities.matches(entity) ||
          layer400Entities.matches(entity)
        );
      })
      .forEach((eId) => {
        const entity = world.getEntity(eId);
        clearInfoBar();

        const isPlural =
          [...entity.description.name][
            [...entity.description.name].length - 1
          ] === 's'
            ? true
            : false;

        const entityText = `${!isPlural ? 'a ' : ''}${
          entity.description.name
        }(${entity.appearance.char})`;

        if (entity.isInFov) {
          drawText({
            text: `You see ${entityText} here.`,
            x: grid.infoBar.x,
            y: grid.infoBar.y,
            color: 'white',
            background: 'black',
          });
        } else {
          drawText({
            text: `You remember seeing ${entityText} here.`,
            x: grid.infoBar.x,
            y: grid.infoBar.y,
            color: 'white',
            background: 'black',
          });
        }
      });
  }
};

const renderInventory = (player) => {
  // translucent to obscure the game map
  drawRect(0, 0, grid.width, grid.height, 'rgba(0,0,0,0.65)');

  drawText({
    text: 'INVENTORY',
    background: 'black',
    color: 'white',
    x: grid.inventory.x,
    y: grid.inventory.y,
  });

  drawText({
    text: '(c)Consume (d)Drop (e)Equip',
    background: 'black',
    color: '#666',
    x: grid.inventory.x,
    y: grid.inventory.y + 1,
  });

  if (player.inventory.inventoryItems.length) {
    player.inventory.inventoryItems.forEach((item, index) => {
      drawText({
        text: `${index === selectedInventoryIndex ? '*' : ' '}${
          item.description.name
        }${item.isEquipped ? '[e]' : ''}`,
        background: 'black',
        color: 'white',
        x: grid.inventory.x,
        y: grid.inventory.y + 3 + index,
      });
    });
  } else {
    drawText({
      text: '-empty-',
      background: 'black',
      color: '#666',
      x: grid.inventory.x,
      y: grid.inventory.y + 3,
    });
  }
};

const renderTargeting = (mPos) => {
  const { x, y, z } = mPos;
  const locId = toLocId({ x, y, z });
  const esAtLoc = readCacheSet('entitiesAtLocation', locId) || [];
  const entitiesAtLoc = [...esAtLoc];

  clearInfoBar();

  if (entitiesAtLoc) {
    if (entitiesAtLoc.some((eId) => world.getEntity(eId).isRevealed)) {
      if (targetRange > 1) {
        drawCircle(x, y, targetRange);
        return;
      }
      drawCell({
        appearance: {
          char: '',
          background: 'rgba(74, 232, 218, 0.5)',
        },
        position: { x, y, z },
      });
    }
  }
};

const renderMenu = () => {
  drawText({
    text: `(n)New (s)Save (l)Load | (i)Inventory (g)Pickup (arrow keys)Move/Attack (mouse)Look/Target`,
    background: '#000',
    color: '#666',
    x: grid.menu.x,
    y: grid.menu.y,
  });
};

export const render = (player) => {
  renderMap();
  renderPlayerHud(player);
  renderPlayerEquipment(player);
  renderMessageLog();
  renderMenu();

  if (gameState === 'INVENTORY') {
    renderInventory(player);
  }
};

const canvas = document.querySelector('canvas');
canvas.onmousemove = throttle((e) => {
  if (gameState === 'GAME') {
    const [x, y] = pxToCell(e);

    if (
      x >= grid.playerEquipment.x &&
      y >= grid.playerEquipment.y &&
      x <= grid.playerEquipment.x + grid.playerEquipment.width &&
      y <= grid.playerEquipment.y + grid.playerEquipment.height
    ) {
      clearEquipmentInfo();
      hoverEquipment(x, y);
    }

    renderMap();
    renderInfoBar({ x, y, z: readCache('z') });
  }

  if (gameState === 'TARGETING') {
    const [x, y] = pxToCell(e);
    renderMap();
    renderTargeting({ x, y, z: readCache('z') });
  }
}, 100);
