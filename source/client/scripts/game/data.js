define(function(){
	return{
			//game ready states
			gameLoaded:false,
		    
		    player:null,
		    
		    monsterInfo: {},
		    itemInfo   : {},
		    abilityInfo : {},

		    currentMap:'No Map',
		    currentSectors:[],
		    newMessages:[],
		    serverInventory:[],
		    changedMap:false,
		    levelUp:false,
		    playerDied:false,
		    revive:false,
		    updateServerData:{
		    	player:{x:null,y:null,rotation:null},

		    	itemChanges:[],
		    		//possible contents of itemChanges
		    		// {DROPPED:itemMenuPosition}
		    		// {SWITCHED:{item menuPosition(origin) : item menuPosition(destination)}}
		    		// {PICKUP:{itemID:item menuPosition}}
		    	message:null,
		    	abilitiesUsed:[],
		    },
		    //static object
		    maps:{},
		};
});