var loader = $("#loader");
var content = $("#content");
var home = $("#home");
var admin = $("#admin");
var user = $("#user");
var adminCheck = null;
var uicInstance;

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',


  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {

      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },


  initContract: function() {
    $.getJSON("UICBuilding.json", function(building) {

      App.contracts.UICBuilding = TruffleContract(building);
      App.contracts.UICBuilding.setProvider(App.web3Provider);
      return App.render();
    });
  },


  render: function() {
    loader.show();
    content.hide();
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Contract Address: " + account);
      }
    });
    return App.getResults()
  },

  home: function(){
    home.show();
    user.hide();
    admin.hide();
  },



  user: function(){
    home.hide();
    user.show();
    admin.hide();
  },
  

  getResults: function() {
    loader.hide();
    content.show();
    var buildingDetails = $('#buildingDetails');
    buildingDetails.empty();

    App.contracts.UICBuilding.deployed().then(function(instance) {
        uicInstance = instance;
        uicInstance.totalBuildings().then(function (obj){return obj.c}).then(function (totalBuildings) {
        
        for (var i = 1; i <= totalBuildings[0]; i++) {
            uicInstance.building(i).then(function(building) {
              var buildingTemp =  "<tr><td class='text-justify'><button type='button' class='btn btn-info btn-block btn-light' data-toggle='modal' data-target='#myModal' onclick='App.getBuildingDetails( "+ building[0] +" )'>" + building[2] + "</button> </td></tr>";
              buildingDetails.append(buildingTemp);
            })
        }
        })
      })
    return App.checkIsAdmin();
  },

  checkIsAdmin: function(){
    var adminButton = $('#adminButton');
    adminButton.attr('disabled','disabled');
    console.log(adminButton)
    if(adminCheck == null){
           App.contracts.UICBuilding.deployed().then(function(instance) {
            uicInstance = instance;
            uicInstance.checkIsAdmin().then(function (status){
              if(status['receipt']['status']){
                adminButton.removeAttr('disabled');
              }
            })
          });
    }
   
},


  admin: function(){
    home.hide();
    user.hide();
    admin.show();
  },

  getBuildingDetails: function(index){
    var buildingIdRes = $('#buildingIdRes');
    var buildingNameRes = $('#buildingNameRes');
    var buildingCodeRes = $('#buildingCodeRes');
    var buildingAddressRes = $('#buildingAddressRes');
    var buildingBuiltDateRes = $('#buildingBuiltDateRes');
    var NASFRes = $('#NASFRes');
    var NUSFRes = $('#NUSFRes');
    var GSFRes = $('#GSFRes');
    var categoryRes = $('#categoryRes');
    var regionRes = $('#regionRes');


    buildingIdRes.empty();
    buildingNameRes.empty();
    buildingCodeRes.empty();
    buildingAddressRes.empty();
    buildingBuiltDateRes.empty();
    NASFRes.empty();
    NUSFRes.empty();
    GSFRes.empty();
    categoryRes.empty();
    regionRes.empty();


    App.contracts.UICBuilding.deployed().then(function(instance) {
      uicInstance = instance;

      uicInstance.building(index).then( function(buildingObject) {
        buildingIdRes.append(buildingObject[1]);
        buildingNameRes.append(buildingObject[2]);
        buildingCodeRes.append(buildingObject[3]);
        buildingAddressRes.append(buildingObject[4]);
        buildingBuiltDateRes.append(buildingObject[5]);
        NASFRes.append(buildingObject[6]);
        NUSFRes.append(buildingObject[7]);
        GSFRes.append(buildingObject[8]);
        categoryRes.append(buildingObject[9]);
        regionRes.append(buildingObject[10]);
      })
    })

  },
  
  
  addBuild: function() {
    var index = document.querySelector('#buildingIndex').value;
    var id = document.querySelector('#buildingId').value;
    var name = document.querySelector('#buildingName').value;
    var code = document.querySelector('#buildingCode').value;
    var address = document.querySelector('#buildingAddress').value;
    var builtDate = document.querySelector('#buildingBuiltDate').value;
    var NASF = document.querySelector('#buildingNASF').value;
    var NUSF = document.querySelector('#buildingNUSF').value;
    var GSF = document.querySelector('#buildingGSF').value;
    var category = document.querySelector('#buildingCategory').value;
    var region = document.querySelector('#buildingRegion').value;

      
    App.contracts.UICBuilding.deployed().then(function(instance) {
        instance.addBuilding(index, id, name, code, address, builtDate, NASF, NUSF, GSF, category, region);
    }).catch(function(err) {
        console.error(err);
      });
    }
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});

