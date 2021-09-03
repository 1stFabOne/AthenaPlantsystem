/************************************************************
 *      PLANT-System for ATHENA-Framework by Der Lord!      *
 * Explanations can be found in this across the source code *      
 ************************************************************/
import { ITEM_TYPE } from '../../shared/enums/itemTypes';
import { Item } from "../../shared/interfaces/Item";
import { appendToItemRegistry } from '../../shared/items/itemRegistry';
import { deepCloneObject } from '../../shared/utility/deepCopy';

const weedPotItem: Item = {
    name: 'Weed Pot',
    description: 'DEBUG: Change me! :( - I am used to plant a WeedPot.',
    icon: 'crate',
    slot: 0,
    quantity: 15,
    behavior:
        ITEM_TYPE.CAN_DROP |
        ITEM_TYPE.CAN_STACK |
        ITEM_TYPE.CONSUMABLE |
        ITEM_TYPE.IS_TOOLBAR,
    data: {
        event: 'Plantsystem:PlacePot',
    }
}
const registerWeedPot: Item = deepCloneObject<Item>(weedPotItem);
appendToItemRegistry(registerWeedPot);
const weedBudsItem: Item = {
    name: 'Buds',
    description: 'DEBUG: Change me :( - I am the return of harvesting a WeedPot.',
    icon: 'crate',
    slot: 0,
    quantity: 0,
    behavior:
        ITEM_TYPE.CAN_DROP |
        ITEM_TYPE.CAN_STACK |
        ITEM_TYPE.CONSUMABLE |
        ITEM_TYPE.IS_TOOLBAR,
    data: {
        event: ''
    }
}
const registerWeedBuds: Item = deepCloneObject<Item>(weedBudsItem);
appendToItemRegistry(registerWeedBuds);

const secateursItem: Item = {
    name: 'secateurs',
    description: 'DEBUG: Change me :( - I am your little harvest helper to harvest WeedPots.',
    icon: 'crate',
    slot: 0,
    quantity: 100,
    behavior:
        ITEM_TYPE.CAN_DROP |
        ITEM_TYPE.CAN_STACK |
        ITEM_TYPE.CONSUMABLE |
        ITEM_TYPE.IS_TOOLBAR,
    data: {
        event: 'Plantsystem:HarvestPot',
    }
}
const registerSecateurs: Item = deepCloneObject<Item>(secateursItem);
appendToItemRegistry(registerSecateurs);

/*
Items if you want to expand the system with water, fertilizer.. and whatever.
const plantWaterItem: Item = {
    name: 'Plantwater',
    description: 'DEBUGItem.. Change me - I am used to water WeedPots.',
    icon: 'crate',
    slot: 0,
    quantity: 25,
    behavior:
        ITEM_TYPE.CAN_DROP |
        ITEM_TYPE.CAN_STACK |
        ITEM_TYPE.CONSUMABLE |
        ITEM_TYPE.IS_TOOLBAR,
    data: {
        event: 'Plantsystem:WaterPot',
        amount: 25
    }
}
const registerPlantWater: Item = deepCloneObject<Item>(plantWaterItem);
appendToItemRegistry(registerPlantWater);

const plantFertilizerItem: Item = {
    name: 'Pot Fertilizer',
    description: 'DEBUGItem.. Change me - I am used to fertilize WeedPots.',
    icon: 'crate',
    slot: 0,
    quantity: 25,
    behavior:
        ITEM_TYPE.CAN_DROP |
        ITEM_TYPE.CAN_STACK |
        ITEM_TYPE.CONSUMABLE |
        ITEM_TYPE.IS_TOOLBAR,
    data: {
        event: 'Plantsystem:FertilizePot',
        amount: 25
    }
}
const registerPlantFertilizer: Item = deepCloneObject<Item>(plantFertilizerItem);
appendToItemRegistry(registerPlantFertilizer);
*/