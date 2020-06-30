QUnit.test("Distance1", function(assert){
  var x = [51,7];
  assert.deepEqual(getDistance(x[0],x[1],x[0],x[1]), 0, "Distance of same points as start and end is 0");
});

QUnit.test("Distance2", function(assert){
  var x = [51,7];
  var y = [60,13];
  assert.deepEqual(getDistance(x[0],x[1],y[0],y[1]), 1189.7032327820861,
    "Distance expected is 1189.7032327820861");
});

QUnit.test("Distance3", function(assert){
  var x = [51,7];
  var y = [55,2];
  assert.deepEqual(getDistance(x[0],x[1],y[0],y[1]), 711.0494827808019,
    "Distance expected is 711049.4827808019");
});

QUnit.test("Distance4", function(assert){
  var x = [51,7];
  var y = [51,6];
  var z = [51,5];
  assert.ok(getDistance(x[0],x[1],y[0],y[1]) < getDistance(x[0],x[1],z[0],z[1]),
    "Distance from point further away greater");
});

QUnit.test("Bearing1", function(assert){
  var x = [51,7];
  assert.deepEqual(getDirection(x[0],x[1],x[0],x[1]), "N",
    "Bearing of same point as start and end is 'N'");
});

QUnit.test("Bearing2", function(assert){
  var y = [51,6];
  var z = [51,5];
  assert.deepEqual(getDirection(y[0],y[1],z[0],z[1]), "S",
    "Expected Bearing is 'S'");
});

QUnit.test("Bearing3", function(assert){
  var x = [51,7];
  var y = [52,7];
  assert.equal(getDirection(x[0],x[1],y[0],y[1]), "E",
    "Expected Bearing is 'E'");
});

QUnit.test("Bearing4", function(assert){
  var x = [51,7];
  var y = [52,7];
  assert.equal(getDirection(y[0],y[1],x[0],x[1]), "W",
    "Expected Bearing is 'W'");
});
