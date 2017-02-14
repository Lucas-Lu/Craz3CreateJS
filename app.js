	var canvas, stage;

	var mouseTarget;	// the display object currently under the mouse, or being dragged
	var dragStarted;	// indicates whether we are currently in a drag operation
	var offset;
	var update = true;
	var squareArr = [[],[],[],[],[],[],[],[],[]];
	var currIndexX,currIndexY;
	init();
	console.log(screenSquareCrash());


	function init() {
		// create stage and point it to the canvas:
		canvas = document.getElementById("testCanvas");

		//check to see if we are running in a browser with touch support 
		stage = new createjs.Stage(canvas);
		stage.x = 50;
		stage.y = 50;

		// enable touch interactions if supported on the current device:
		createjs.Touch.enable(stage);

		// enabled mouse over / out events
		stage.enableMouseOver(10);
		stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas


		addSquare ();
		// load the source image:

	}

	function addSquare () {
		var container = new createjs.Container();
		stage.addChild(container);
    	for(var indexX = 0 ; indexX < 9 ; indexX ++){
	        for(var indexY = 0; indexY < 9 ; indexY ++){
	        	var image = new Image();
	        	var squaretype = Math.floor(Math.random() * 7) + 1;
		        image.src = "bitmaps/skill_0" + squaretype + ".png";
		        image.onload = function(event){
		        	var image = event.target;
		        	var hitArea = new createjs.Shape();
	                hitArea.graphics.beginFill("#FFF").drawEllipse(-11, -14, 24, 18);
	                // create a shape that represents the center of the daisy image:
	                
	                // position hitArea relative to the internal coordinate system of the target bitmap instances:
	                hitArea.x = image.width / 2 ;
	                hitArea.y = image.height / 2 ;
	                for(var i = 0;i < 9;i ++){
	                	for(var j = 0;j < 9;j ++){
	                		squareArr[i][j].hitArea = hitArea;
	                	}
	                }
		        };
		         
	            // create and populate the screen with random daisies:

		        var bitmap = new createjs.Bitmap(image);
		        squareArr[indexX][indexY] = bitmap;
		        container.addChild(bitmap);
		        bitmap.x = indexX * 55;
		        bitmap.y = indexY * 55;
		        bitmap.scaleX = bitmap.scaleY = 1;
		        bitmap.name = "bmp_" + indexX + "_" + indexY;
		        bitmap.squaretype = squaretype;
		        bitmap.cursor = "pointer";

		        // assign the hit area:
		        //bitmap.hitArea = hitArea;

		        bitmap.addEventListener("mousedown", function (evt) {
		        	// bump the target in front of its siblings:
		        	var o = evt.target;
		        	o.parent.addChild(o);
		            if(currIndexX == null || currIndexX <0){
		            	currIndexX = o.x / 55;
		            	currIndexY = o.y / 55;
		            }

		        	o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
		        });

		        // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
		        bitmap.addEventListener("pressmove", function (evt) {
		        	var o = evt.target;
		        	var moveDistanceX = evt.stageX + o.offset.x - currIndexX * 55;
		        	var moveDistanceY = evt.stageY + o.offset.y - currIndexY * 55;
		        	if(Math.abs(moveDistanceX) >= Math.abs(moveDistanceY)){
		        		if(Math.abs(moveDistanceX) > 55){
		        			o.x = currIndexX * 55 + (moveDistanceX > 0 ? (currIndexX == 8 ? 0 : 55) : (currIndexX == 0 ? 0 : -55));
		        		}
		        		else{
		        			o.x = evt.stageX + o.offset.x;
		        		}
		        		o.y = currIndexY * 55;
		        	}
		        	else{
		        		if(Math.abs(moveDistanceY) > 55){
		        			o.y = currIndexY * 55 + (moveDistanceY > 0 ? (currIndexY == 8 ? 0 : 55) : (currIndexY == 0 ? 0 : -55));
		        		}
		        		else{
		        		    o.y = evt.stageY + o.offset.y;
		        		}
		        		o.x = currIndexX * 55;
		        	}
		        	
		        	// indicate that the stage should be updated on the next tick:
		        	update = true;
		        });

		         bitmap.addEventListener("pressup", function (evt) {
		         	var moveDistanceX = evt.target.x - currIndexX * 55;
		        	var moveDistanceY = evt.target.y - currIndexY * 55;
		         	if(moveDistanceX != 0){
		         		if(Math.abs(moveDistanceX) > 30){
		         			var s_new = squareArr[currIndexX + (moveDistanceX > 0 ? 1 : -1)][currIndexY];
		         			switchBitMapImage(s_new,squareArr[currIndexX][currIndexY]);
		         		}
		         	}
		         	else{
		         		if(Math.abs(moveDistanceY) > 30){
		         			var s_new = squareArr[currIndexX][currIndexY + (moveDistanceY > 0 ? 1 : -1)];
							switchBitMapImage(s_new,squareArr[currIndexX][currIndexY]);
		         		}
		         	}
		         	var currSquare = squareArr[currIndexX][currIndexY];
		         	currSquare.x = currIndexX * 55;
		         	currSquare.y = currIndexY * 55;
		        	currIndexX = -1;
		            var scroe = screenSquareCrash();
		            if(scroe == 0){

		            }
		        	// indicate that the stage should be updated on the next tick:
		        	update = true;
		        });

	        }

     	}
     	createjs.Ticker.addEventListener("tick", tick);
    }

	function stop() {
		createjs.Ticker.removeEventListener("tick", tick);
	}

	function switchBitMapImage(sourcebitmap,targetbitmap){
		var sourceSquareType = sourcebitmap.squaretype;
		var sourceImage = sourcebitmap.image;
		sourcebitmap.squaretype = targetbitmap.squaretype;
		targetbitmap.squaretype = sourceSquareType;
		sourcebitmap.image = targetbitmap.image;
		targetbitmap.image = sourceImage;
	}

	function screenSquareCrash(){
		var crashedIndexsArr = [];
		for(var indexX = 0 ; indexX < 9 ; indexX ++){
			var squareTypeArr = [];
			for(var indexY = 0 ; indexY < 9 ;indexY ++){
				squareTypeArr.push(squareArr[indexX][indexY].squaretype);
			}
			var crashedIndexArr = returnCrashedIndexArr(squareTypeArr);
			var crashNums = crashedIndexArr.length;
			for(var i =0 ; i < crashNums ; i ++){
				var c = new crashlocation();
				c.index_X = indexX;	
				c.index_Y = crashedIndexArr.pop();
				crashedIndexsArr.push(c);
			}
		}
		for(var indexY = 0 ; indexY < 9 ; indexY ++){
			var squareTypeArr = [];
			for(var indexX = 0 ; indexX < 9 ;indexX ++){
				squareTypeArr.push(squareArr[indexX][indexY].squaretype);
			}
			console.log(squareTypeArr);
			var crashedIndexArr = returnCrashedIndexArr(squareTypeArr);
			console.log(crashedIndexArr);
			var crashNums = crashedIndexArr.length;
			for(var i = 0 ; i < crashNums ; i ++ ){
				var c = new crashlocation();
				c.index_Y = indexY;
				c.index_X = crashedIndexArr.pop();
				crashedIndexsArr.push(c);
			}
		}
		for(var i = 0; i < crashedIndexsArr.length ; i ++ ){
			var c = crashedIndexsArr[i];
			console.log(c);
			for(var j = 0;j < c.index_Y ; j++){
				switchBitMapImage(squareArr[c.index_X][c.index_Y - j],squareArr[c.index_X][c.index_Y - j - 1]);
				stage.update();
				//	sleep(1); 
			}
			var image = new Image();
	        var squaretype = Math.floor(Math.random() * 7) + 1;
		    image.src = "bitmaps/skill_0" + squaretype + ".png";
		    squareArr[c.index_X][0].image = image;
		    squareArr[c.index_X][0].squaretype = squaretype;
			stage.update();
		}
		console.log(crashedIndexsArr);
		return crashedIndexsArr.length;
	}

	function returnCrashedIndexArr (squareTypeArr) {
		var sameCount = 0;
		var crashedIndexArr = [];
		for(var i = 1 ; i < squareTypeArr.length; i ++){
			if(squareTypeArr[i] == squareTypeArr[i - 1]){
			   sameCount ++;
			}
			else{
				if(sameCount > 1){
					for(var j = 1;j <= sameCount + 1; j++){
						crashedIndexArr.push(i - j);
					}
				}
				sameCount = 0;
			}
			if(i == squareTypeArr.length - 1){
				if(sameCount > 1){
					for(var j = 0;j <= sameCount ; j++){
						crashedIndexArr.push(i - j);
					}
				}
			}
		}
		return crashedIndexArr;
	}

	function crashlocation(){
		this.index_X = 1;
		this.index_Y = 2;
	}

	function tick(event) {
		// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
		if (update) {
			update = false; // only update once
			stage.update(event);
		}
	}

	function pause(){
		console.log(1);
	}

	function bitmapSquare(){

	}