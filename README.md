# Basic Plantsystem for Athena Framework (GTA V) by Der Lord!

![unknown](https://user-images.githubusercontent.com/82890183/131876685-13775cce-d8ee-4eb5-b95e-b3ad8520a3cf.png)

# Features:
* Add unlimited placing spots for your players where they can plant.
* Enable/Disable Blip System, make it harder to find all your placing spots.
* Place new pots easily per TOOLBAR & Harvest them by TOOLBAR as well.
* Scenario for gardening the plants.
* Random return of weed buds which can be easily configured inside of the source code.
* Database stored plants

![image](https://user-images.githubusercontent.com/82890183/131878762-6e99fa50-45e8-4f98-bf29-1d52e5ecaccf.png)
![image](https://user-images.githubusercontent.com/82890183/131878858-49770085-50a0-4092-bc3c-5a0f4282f1cc.png)

# SETUP (Read carefully)!
* This is a serverside plugin! It has to be added in your local athena repository here: (/src/core/plugins/Plantsystem)
* Go to your .env file inside of your local Athena repository and add "MONGO_COLLECTIONS=plants" without the quotes.
* Configuration Options can be found below.
* This is probably not the right plugin for you if you don't know how to extend it any further since this is just a really basic version and could contain a few bugs still, we tested it with 3 people didn't find any. But maybe there will be some issues with the GiveItemHandling(?)

# Import.ts (src/core/plugins/import.ts)
```typescript
    './Plantsystem/index',
    './Plantsystem/interface',
    './Plantsystem/items',
```


# interface.ts
```typescript
const smallPlant = 'bkr_prop_weed_01_small_01a';
const mediumPlant = 'bkr_prop_weed_med_01a';
const bigPlant = 'bkr_prop_weed_lrg_01a';

const harvestDuration = 5000; // Duration for Harvesting in MS

const fertilizeDuration = 5000; // Duration for Fertilizing in MS
const fertilizerRemoveTime = 30; // How many minutes will the fertilizer remove?

const wateringDuration = 5000; // Duration for Watering in MS
const minRequiredWater = 50; // How much water is minimum needed for the plant to grow?
const waterLossPerMinute = 5;

const minBuds = 25; // Min output as weedbuds from harvesting
const maxBuds = 50; // Maximum output as weedbuds from harvesting
```


# index.ts
```typescript

const plantInterval = 1000; // How long will it take to remove a minute in ms? default: 60000
const plantSystemEnabled = true; // If enabled update interval will start on bootup of Athena. default: true

// Add whatever spots you like here (Press F1 with administrative rights ingame to get Pos from the alt:V Dev Console)
// #default spots 3, add more if you need
const validPlantPlaceSpots = [
    { "x": -2006.942138671875, "y": 2568.26953125, "z": 2.7962563037872314 },
    { "x": -2010.500732421875, "y": 2568.917236328125, "z": 2.7646090984344482 },
    { "x": -2012.62451171875, "y": 2565.571044921875, "z": 2.746884346008301 },
    { "x": -2007.74267578125, "y": 2564.00341796875, "z": 2.6880717277526855 },
    { "x": -2020.5887451171875, "y": 2566.855224609375, "z": 2.6964898109436035 },
    { "x": -2020.66455078125, "y": 2572.015625, "z": 2.710820198059082 },
    { "x": -2020.5101318359375, "y": 2577.8818359375, "z": 2.778646469116211 },
    { "x": -2016.6363525390625, "y": 2578.458251953125, "z": 3.48949933052063 },
    { "x": -2011.7757568359375, "y": 2578.625732421875, "z": 3.5605852603912354 },
    { "x": -2004.8231201171875, "y": 2575.834716796875, "z": 2.8564610481262207 }
];

const distanceToValidSpot: number = 5; // Distance the player can have to a valid spot. default: 5
const appendBlips: any = true; // Blips enabled? default: true
``` 


![image](https://user-images.githubusercontent.com/82890183/132117657-ace30926-9e87-4d04-bf47-2d55aef9a00b.png)
