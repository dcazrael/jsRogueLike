import { Engine } from 'geotic';
import {
  ActiveEffects,
  Ai,
  Animate,
  Appearance,
  Defense,
  Description,
  Dropped,
  Effects,
  EquipmentEffect,
  EquipmentSlot,
  Health,
  Inventory,
  IsBlocking,
  IsDead,
  IsEquippable,
  IsEquipped,
  IsInFov,
  IsOpaque,
  IsPickup,
  IsRevealed,
  IsStairs,
  Layer100,
  Layer300,
  Layer400,
  Move,
  Paralyzed,
  Position,
  Power,
  RequiresTarget,
  Slot,
  Target,
  TargetingItem,
} from './components/';
import {
  Armor,
  Being,
  Boots,
  Chest,
  Floor,
  Gear,
  Goblin,
  GoblinWarrior,
  HealthPotion,
  Helmet,
  Item,
  Player,
  ScrollFireball,
  ScrollLightning,
  ScrollParalyze,
  Shield,
  StairsDown,
  StairsUp,
  Tile,
  Wall,
  Weapon,
} from './prefabs';

export const ecs = new Engine();

// all Components must be `registered` by the engine
ecs.registerComponent(ActiveEffects);
ecs.registerComponent(Animate);
ecs.registerComponent(Ai);
ecs.registerComponent(Appearance);
ecs.registerComponent(Description);
ecs.registerComponent(Defense);
ecs.registerComponent(Dropped);
ecs.registerComponent(Effects);
ecs.registerComponent(EquipmentSlot);
ecs.registerComponent(EquipmentEffect);
ecs.registerComponent(Health);
ecs.registerComponent(Inventory);
ecs.registerComponent(IsBlocking);
ecs.registerComponent(IsDead);
ecs.registerComponent(IsEquippable);
ecs.registerComponent(IsEquipped);
ecs.registerComponent(IsInFov);
ecs.registerComponent(IsOpaque);
ecs.registerComponent(IsPickup);
ecs.registerComponent(IsRevealed);
ecs.registerComponent(IsStairs);
ecs.registerComponent(Layer100);
ecs.registerComponent(Layer300);
ecs.registerComponent(Layer400);
ecs.registerComponent(Move);
ecs.registerComponent(RequiresTarget);
ecs.registerComponent(Paralyzed);
ecs.registerComponent(Position);
ecs.registerComponent(Power);
ecs.registerComponent(Slot);
ecs.registerComponent(Target);
ecs.registerComponent(TargetingItem);

// register "primitives" first!

// register "base" prefabs first!
ecs.registerPrefab(Tile);
ecs.registerPrefab(Being);
ecs.registerPrefab(Item);
ecs.registerPrefab(Gear);

// tiles
ecs.registerPrefab(Floor);
ecs.registerPrefab(StairsDown);
ecs.registerPrefab(StairsUp);
ecs.registerPrefab(Wall);

// items
ecs.registerPrefab(HealthPotion);
ecs.registerPrefab(ScrollFireball);
ecs.registerPrefab(ScrollLightning);
ecs.registerPrefab(ScrollParalyze);

// equipment
ecs.registerPrefab(Armor);
ecs.registerPrefab(Boots);
ecs.registerPrefab(Chest);
ecs.registerPrefab(Helmet);
ecs.registerPrefab(Shield);
ecs.registerPrefab(Weapon);

// enemies
ecs.registerPrefab(Goblin);
ecs.registerPrefab(GoblinWarrior);

// player
ecs.registerPrefab(Player);

const world = ecs.createWorld();
export default world;
