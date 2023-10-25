require('../models/database');
const Photographer = require('../models/Photographer');
const Packages = require('../models/Packages');
const Decorator = require('../models/Decorator');
const Caterer = require('../models/Caterer');
const Invitation = require('../models/Invitation');
const usermiddle = require('../middleware/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Entertainer = require('../models/entertainer');
const Venue = require('../models/venues');
const User = require('../models/User');
const Review = require('../models/Review');


/**
 * GET /
 * 
*/
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 10;
    const limitReview = 3;
    
    const packages = await Packages.find({}).limit(limitNumber);
    const reviews = await Review.find({}).limit(limitReview); 
    
    res.render('index', { packages,reviews,});
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/**Open User Prfile Page */
exports.openProfile = async(req,res) => {
  const userid = req.session.uid;

  const user = await User.findOne({_id : userid});
  const email = user.email;
  const role = user.role;
  const username = user.username;

  if(userid)
  {
    return res.render('userProfile',{userid : userid , role : role , username : username , email : email});
  }
  else{
    return res.redirect('/login') ;
  }
}

/**Edit Username */
exports.editProfile = async(req,res) => {
  let userid = req.params.id;

  const user = await User.findOne({_id : userid});
  const newname = req.body.username;
console.log(newname);
  user.username = newname;

  await user.save();

  return res.redirect('/profile');
}

/**Home To Vendor Dashboard */
exports.homeToVendor = async(req,res) => {
  const WarningData = req.flash('warndata');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');

  const userid = req.session.uid;

  const user = await User.findOne({_id : userid});

  const role = user.role;

  if(role === 'vendor')
  {
    return res.render('addeditvendor' , {userid : userid  , ErrorData : null , SubmitData : null , WarningData : WarningData});
  }
  else
  {
    return res.redirect('/');
  }
}
/**----------------------------------------------------------------packages------------------------------------------------------ */


/**
 * GET / packages
 * 
*/
exports.explorePackages = async (req, res) => {

  Packages.find({}).then(packages => {
    res.render('index',
      {
        packagesList: packages
      })
  }
  )
}

/**
 * GET /package name 
 *
 */
exports.packageName = async (req, res) => {
  try {
    let packageId = req.params.id;
    const packages = await Packages.findById(packageId);
    res.render('packages',
      { packages });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.submitPackages = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  const WarningData = req.flash('warndata');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const userid = req.params.id;
  const user = await Packages.findOne({userid});
if(user)
  {
    req.flash('warndata','Package already exists with this account , To add new , create new Account !!');
    return res.render('addeditvendor' , {userid : userid  , ErrorData : null , SubmitData : null , WarningData : WarningData});
  }
  res.render('packages_form', {title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj, userid: userid });
}


/**
 * POST /submit-package
 */
exports.updateonsubmitPackage = async (req, res) => {
  const userid = req.params.id;
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  const WarningData = req.flash('warndata');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  try {

    let pkgImageUploadFile;
    let pkgUploadPath;
    let pkgNewImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
    } else {

      pkgImageUploadFile = req.files.apImg;
      pkgNewImageName = Date.now() + pkgImageUploadFile.name;

      pkgUploadPath = require('path').resolve('./') + '/public/images/' + pkgNewImageName;

      pkgImageUploadFile.mv(pkgUploadPath, function (err) {
        if (err) return res.status(500).send(err);
      })

    }
    const basicItem = Array.isArray(req.body.basicItem) ? req.body.basicItem : [req.body.basicItem];
    const basicPrice = Array.isArray(req.body.basicPrice) ? req.body.basicPrice : [req.body.basicPrice];

    const bItemList = [];

    for (let i = 0; i < Math.max(basicItem.length, basicPrice.length); i++) {
      const basic_Item = basicItem[i] || ''; // Use empty string if package name doesn't exist
      const basic_Price = basicPrice[i] || ''; // Use 0 if package price doesn't exist
      bItemList.push({ basicItem: basic_Item, basicPrice: basic_Price });
    }

    const basicDesTitle = Array.isArray(req.body.basicDesTitle) ? req.body.basicDesTitle : [req.body.basicDesTitle];
    const basicDes = Array.isArray(req.body.basicDes) ? req.body.basicDes : [req.body.basicDes];

    const bDesList = [];

    for (let i = 0; i < Math.max(basicDesTitle.length, basicDes.length); i++) {
      const basic_DesTitle = basicDesTitle[i] || ''; // Use empty string if package name doesn't exist
      const basic_Des = basicDes[i] || ''; // Use 0 if package price doesn't exist
      bDesList.push({ basicDesTitle: basic_DesTitle, basicDes: basic_Des });
    }

    const premiumItem = Array.isArray(req.body.premiumItem) ? req.body.premiumItem : [req.body.premiumItem];
    const premiumPrice = Array.isArray(req.body.premiumPrice) ? req.body.premiumPrice : [req.body.premiumPrice];

    const pItemList = [];

    for (let i = 0; i < Math.max(premiumItem.length, premiumPrice.length); i++) {
      const premium_Item = premiumItem[i] || ''; // Use empty string if package name doesn't exist
      const premium_Price = premiumPrice[i] || ''; // Use 0 if package price doesn't exist
      pItemList.push({ premiumItem: premium_Item, premiumPrice: premium_Price });
    }

    const premiumDesTitle = Array.isArray(req.body.premiumDesTitle) ? req.body.premiumDesTitle : [req.body.premiumDesTitle];
    const premiumDes = Array.isArray(req.body.premiumDes) ? req.body.premiumDes : [req.body.premiumDes];

    const pDesList = [];

    for (let i = 0; i < Math.max(premiumDesTitle.length, premiumDes.length); i++) {
      const premium_DesTitle = premiumDesTitle[i] || ''; // Use empty string if package name doesn't exist
      const premium_Des = premiumDes[i] || ''; // Use 0 if package price doesn't exist
      pDesList.push({ premiumDesTitle: premium_DesTitle, premiumDes: premium_Des });
    }

    const ultimateItem = Array.isArray(req.body.ultimateItem) ? req.body.ultimateItem : [req.body.ultimateItem];
    const ultimatePrice = Array.isArray(req.body.ultimatePrice) ? req.body.ultimatePrice : [req.body.ultimatePrice];

    const uItemList = [];

    for (let i = 0; i < Math.max(ultimateItem.length, ultimatePrice.length); i++) {
      const ultimate_Item = ultimateItem[i] || ''; // Use empty string if package name doesn't exist
      const ultimate_Price = ultimatePrice[i] || ''; // Use 0 if package price doesn't exist
      uItemList.push({ ultimateItem: ultimate_Item, ultimatePrice: ultimate_Price });
    }

    const ultimateDesTitle = Array.isArray(req.body.ultimateDesTitle) ? req.body.ultimateDesTitle : [req.body.ultimateDesTitle];
    const ultimateDes = Array.isArray(req.body.ultimateDes) ? req.body.ultimateDes : [req.body.ultimateDes];

    const uDesList = [];

    for (let i = 0; i < Math.max(ultimateDesTitle.length, ultimateDes.length); i++) {
      const ultimate_DesTitle = ultimateDesTitle[i] || ''; // Use empty string if package name doesn't exist
      const ultimate_Des = ultimateDes[i] || ''; // Use 0 if package price doesn't exist
      uDesList.push({ ultimateDesTitle: ultimate_DesTitle, ultimateDes: ultimate_Des });
    }
    const newPackage = new Packages({
      pkgcmpyname: req.body.pkgcmpyname,
      pkgname: req.body.pkgname,
      apImg: pkgNewImageName,
      totalBasicPrice: req.body.totalBasicPrice,
      totalPremiumPrice: req.body.totalPremiumPrice,
      totalUltimatePrice: req.body.totalUltimatePrice,
      userid : req.params.id,
     });


     newPackage.bItemList = bItemList;
     newPackage.bDesList = bDesList;
     newPackage.pItemList = pItemList;
     newPackage.pDesList = pDesList;
     newPackage.uItemList = uItemList;
     newPackage.uDesList = uDesList;
    await newPackage.save();

    req.flash('infoSubmit', 'Package has been added');
    return res.render('addeditvendor',{userid : userid , ErrorData : null , SubmitData : SubmitData , WarningData : null});
  } catch (error) {
    req.flash('infoErrors', error);
    console.log(error);
    res.redirect('/packages_form');
  }
}

/**
 * 
 * GET /Edit package 
 */
exports.packagesEdit = async (req, res) => {
  try {
    const infoErrorsObjcatererupd = req.flash('infoErrorscatererupd');
    const infoSubmitObjcatererupd = req.flash('infoSubmitcatererupd');
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
   const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
  
    const userid = req.params.id;
  
    const user = await Packages.findOne({userid});
  
    if(!user)
    {
      req.flash('errordata','No such User Exists for packages !!');
      return res.render('addeditvendor' , { userid : userid  , ErrorData : ErrorData , SubmitData : null , WarningData : null});
    }
   
    const packagesId = user._id;
    const packages = await Packages.findById(packagesId)
    res.render('packages_edit', { packages,user, infoErrorsObj, infoSubmitObj,userid:userid })

  }
  catch (err) {
    res.status(500).send(err)
  }
} 

/**
 * POST/ edit package 
 */
exports.packagesEditPost = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await Packages.findOne({userid});
    const packagesId=user._id;
    const infoErrorsObjcatererupd = req.flash('infoErrorscatererupd');
    const infoSubmitObjcatererupd = req.flash('infoSubmitcatererupd');
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
    let pkgImageUploadFile;
    let pkgUploadPath;
    let pkgNewImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } else {

      pkgImageUploadFile = req.files.apImg;
      pkgNewImageName = Date.now() + pkgImageUploadFile.name;
      pkgUploadPath = require('path').resolve('./') + '/public/images/' + pkgNewImageName;
      pkgImageUploadFile.mv(pkgUploadPath, function (err) {
        if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      console.log('File uploaded successfully!');
      })

    }

    const basicItem = Array.isArray(req.body.basicItem) ? req.body.basicItem : [req.body.basicItem];
    const basicPrice = Array.isArray(req.body.basicPrice) ? req.body.basicPrice : [req.body.basicPrice];

    const bItemList = [];

    for (let i = 0; i < Math.max(basicItem.length, basicPrice.length); i++) {
      const basic_Item = basicItem[i] || ''; // Use empty string if package name doesn't exist
      const basic_Price = basicPrice[i] || ''; // Use 0 if package price doesn't exist
      bItemList.push({ basicItem: basic_Item, basicPrice: basic_Price });
    }

    const basicDesTitle = Array.isArray(req.body.basicDesTitle) ? req.body.basicDesTitle : [req.body.basicDesTitle];
    const basicDes = Array.isArray(req.body.basicDes) ? req.body.basicDes : [req.body.basicDes];

    const bDesList = [];

    for (let i = 0; i < Math.max(basicDesTitle.length, basicDes.length); i++) {
      const basic_DesTitle = basicDesTitle[i] || ''; // Use empty string if package name doesn't exist
      const basic_Des = basicDes[i] || ''; // Use 0 if package price doesn't exist
      bDesList.push({ basicDesTitle: basic_DesTitle, basicDes: basic_Des });
    }

    const premiumItem = Array.isArray(req.body.premiumItem) ? req.body.premiumItem : [req.body.premiumItem];
    const premiumPrice = Array.isArray(req.body.premiumPrice) ? req.body.premiumPrice : [req.body.premiumPrice];

    const pItemList = [];

    for (let i = 0; i < Math.max(premiumItem.length, premiumPrice.length); i++) {
      const premium_Item = premiumItem[i] || ''; // Use empty string if package name doesn't exist
      const premium_Price = premiumPrice[i] || ''; // Use 0 if package price doesn't exist
      pItemList.push({ premiumItem: premium_Item, premiumPrice: premium_Price });
    }

    const premiumDesTitle = Array.isArray(req.body.premiumDesTitle) ? req.body.premiumDesTitle : [req.body.premiumDesTitle];
    const premiumDes = Array.isArray(req.body.premiumDes) ? req.body.premiumDes : [req.body.premiumDes];

    const pDesList = [];

    for (let i = 0; i < Math.max(premiumDesTitle.length, premiumDes.length); i++) {
      const premium_DesTitle = premiumDesTitle[i] || ''; // Use empty string if package name doesn't exist
      const premium_Des = premiumDes[i] || ''; // Use 0 if package price doesn't exist
      pDesList.push({ premiumDesTitle: premium_DesTitle, premiumDes: premium_Des });
    }

    const ultimateItem = Array.isArray(req.body.ultimateItem) ? req.body.ultimateItem : [req.body.ultimateItem];
    const ultimatePrice = Array.isArray(req.body.ultimatePrice) ? req.body.ultimatePrice : [req.body.ultimatePrice];

    const uItemList = [];

    for (let i = 0; i < Math.max(ultimateItem.length, ultimatePrice.length); i++) {
      const ultimate_Item = ultimateItem[i] || ''; // Use empty string if package name doesn't exist
      const ultimate_Price = ultimatePrice[i] || ''; // Use 0 if package price doesn't exist
      uItemList.push({ ultimateItem: ultimate_Item, ultimatePrice: ultimate_Price });
    }

    const ultimateDesTitle = Array.isArray(req.body.ultimateDesTitle) ? req.body.ultimateDesTitle : [req.body.ultimateDesTitle];
    const ultimateDes = Array.isArray(req.body.ultimateDes) ? req.body.ultimateDes : [req.body.ultimateDes];

    const uDesList = [];

    for (let i = 0; i < Math.max(ultimateDesTitle.length, ultimateDes.length); i++) {
      const ultimate_DesTitle = ultimateDesTitle[i] || ''; // Use empty string if package name doesn't exist
      const ultimate_Des = ultimateDes[i] || ''; // Use 0 if package price doesn't exist
      uDesList.push({ ultimateDesTitle: ultimate_DesTitle, ultimateDes: ultimate_Des });
    }

    const packages = await Packages.findOneAndUpdate({ _id: packagesId }, {
      $set: {
        pkgcmpyname: req.body.pkgcmpyname,
        pkgname: req.body.pkgname,
        apImg: pkgNewImageName,
        totalBasicPrice: req.body.totalBasicPrice,
        totalPremiumPrice: req.body.totalPremiumPrice,
        totalUltimatePrice: req.body.totalUltimatePrice,
        bItemList:bItemList,
        bDesList:bDesList,
        pItemList:pItemList,
        pDesList:pDesList,
        uItemList:uItemList,
        uDesList:uDesList
      }
    },
      { upsert: true, new: true }
    )

    packages.save();
    req.flash('subdata', 'Package updated successfully !!');
    return res.render('addeditvendor' , {userid : userid , ErrorData : null , SubmitData : SubmitData , WarningData : null}); // Redirect to a success page or home page


  }
  catch (err) {
    const userid=res.params.id
    req.flash('infoErrorsdecorupd', 'Error Occurred !!');
    return res.redirect('/packages/edit/' +`${userid}`);
  }
}

/*      req.flash('subdata', 'Package updated successfully !!');
      return res.render('addeditvendor' , {userid : userid , ErrorData : null , SubmitData : SubmitData , WarningData : null}); // Redirect to a success page or home page
    } 
   
   catch (error) {
    const userid = req.params.id;
    console.log(error);
    req.flash('infoErrorsdecorupd', 'Error Occurred !!');
    return res.redirect('/packages/edit/' +`${userid}`); // Redirect to the edit form
  } */

exports.deletePackages = async (req, res) => {
  try {
    const userid = req.params.id;
    const packages = await Packages.findByIdAndDelete(userid);

     await packages.save();

    res.redirect('/');

  }
  catch (err) {
    res.status(500).send(err)
  }
}
//Add more basic items
//GET
exports.addPackagesList = async (req, res) => {
  const userid = req.params.id;
  const packages = await Packages.findById(userid)
  res.render('addPackagesList', { packages })
}

 

//POST
exports.addPackagesListOnPost = async (req, res) => {
  try {
    const userid = req.params.id;
    const { basicItem, basicPrice } = req.body;
    const { basicDesTitle, basicDes } = req.body;
    const { premiumItem, premiumPrice } = req.body;
    const { premiumDesTitle, premiumDes } = req.body;
    const { ultimateItem, ultimatePrice } = req.body;
    const { ultimateDesTitle, ultimateDes } = req.body;

    const bItemListToAdd = [];
    const bDesListToAdd = [];
    const pItemListToAdd = [];
    const pDesListToAdd = [];
    const uItemListToAdd = [];
    const uDesListToAdd = [];

    if(basicItem!='' && basicPrice!=''){
      if (Array.isArray(basicItem)) {
        // If basicItem is an array, iterate through each element
        for (let i = 0; i < basicItem.length; i++) {
         const name = basicItem[i];
         const price = basicPrice[i] || 0;
         bItemListToAdd.push({ basicItem: name, basicPrice: price });
       }
     } else{
      // If basicItem is not an array, convert it into an array
       bItemListToAdd.push({ basicItem, basicPrice: basicPrice || 0 });
     }
    }

    if(basicDes!='' && basicDesTitle!=''){
      if (Array.isArray(basicDesTitle)) {
        // If basicDesTitle is an array, iterate through each element
        for (let i = 0; i < basicDesTitle.length; i++) {
          const name = basicDesTitle[i];
          const des = basicDes[i] || 0;
          bDesListToAdd.push({ basicDesTitle: name, basicDes: des });
        }
      } else{
        // If basicDesTitle is not an array, convert it into an array
        bDesListToAdd.push({ basicDesTitle, basicDes: basicDes || '' });
      }
    }

    if(premiumItem!='' && premiumPrice!=''){
      if (Array.isArray(premiumItem)) {
        // If premiumItem is an array, iterate through each element
        for (let i = 0; i < premiumItem.length; i++) {
         const name = premiumItem[i];
         const price = premiumPrice[i] || 0;
         pItemListToAdd.push({ premiumItem: name, premiumPrice: price });
       }
       } else {
          // If premiumItem is not an array, convert it into an array
          pItemListToAdd.push({ premiumItem, premiumPrice: premiumPrice || 0 });
       }
    }

    if(premiumDesTitle!='' && premiumDes!=''){
      if (Array.isArray(premiumDesTitle)) {
        // If premiumDesTitle is an array, iterate through each element
        for (let i = 0; i < premiumDesTitle.length; i++) {
          const name = premiumDesTitle[i];
          const des = premiumDes[i] || '';
          pDesListToAdd.push({ premiumDesTitle: name, premiumDes: des });
        }
      } else{
        // If basicItem is not an array, convert it into an array
        pDesListToAdd.push({ premiumDesTitle, premiumDes: premiumDes || '' });
      }
    }

    if(ultimateItem!='' && ultimatePrice!=''){
      if (Array.isArray(ultimateItem)) {
        // If ultimateItem is an array, iterate through each element
        for (let i = 0; i < ultimateItem.length; i++) {
         const name = ultimateItem[i];
         const price = ultimatePrice[i] || 0;
         uItemListToAdd.push({ ultimateItem: name, ultimatePrice: price });
       }
     } else {
       // If basicItem is not an array, convert it into an array
       uItemListToAdd.push({ ultimateItem, ultimatePrice: ultimatePrice || 0 });
     }
    }

    if(ultimateDes!='' && ultimateDesTitle!=''){
      if (Array.isArray(ultimateDesTitle)) {
        // If ultimateDesTitle is an array, iterate through each element
        for (let i = 0; i < ultimateDesTitle.length; i++) {
         const name = ultimateDesTitle[i];
         const price = ultimateDes[i] || '';
         uDesListToAdd.push({ ultimateDesTitle: name, ultimateDes: price });
       }
     } else {
       // If basicItem is not an array, convert it into an array
       uDesListToAdd.push({ ultimateDesTitle, ultimateDes: ultimateDes || 0 });
     }
    }

    await Packages.findOneAndUpdate(
      {userid },
      {
        $push: {
          bItemList: {
            $each: bItemListToAdd
          },
          bDesList: {
            $each: bDesListToAdd
          },
          pItemList: {
            $each: pItemListToAdd
          },
          pDesList: {
            $each: pDesListToAdd
          },
          uItemList: {
            $each: uItemListToAdd
          },
          uDesList: {
            $each: uDesListToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'List Added!')
    res.redirect('/packages/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors', error);
    res.status(500).send(error)
  }
}

//Delete List
exports.delPackagesList = async (req, res) => {
  try {
    const userid = req.params.id;
    const bItemListId = req.params.pid;
    const bDesListId = req.params.pid;
    const pItemListId = req.params.pid;
    const pDesListId = req.params.pid;
    const uItemListId = req.params.pid;
    const uDesListId = req.params.pid;
    const packages = await Packages.findById(userid);

    packages.bItemList.pull(bItemListId)
    packages.bDesList.pull(bDesListId)
    packages.pItemList.pull(pItemListId)
    packages.pDesList.pull(pDesListId)
    packages.uItemList.pull(uItemListId)
    packages.uDesList.pull(uDesListId)

    await packages.save();

    req.flash('infoSubmit', 'List deleted successfully!')
    res.redirect('/packages/edit/' + `${userid}`);

  }
  catch (err) {
    req.flash('infoErrors', err);
    res.status(500).send(err)
  }
}

/**--------------------------------------------------------user-signup------------------------------------------------------ */

/**
 * GET / signup
 * signup form
*/
exports.signup = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('signup', { infoErrorsObj, infoSubmitObj })
}

// Signup Function
exports.signupnew = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  // }

  const { username, email, password, role, confirm_password } = req.body;

  try {
    let errors = [];
    if (!username || !email || !password || !role || !confirm_password) {
      // Data is missing, set a flash message and redirect
      // req.flash('infoErrors', 'Please fill in all the required fields.');
      // return res.redirect('/signup');
      errors.push('Please Fill in All Required Fields');
    }

    var reg_pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,}$/;



    let user = await User.findOne({ email });

    if (user) {
      // req.flash('infoErrors', 'User already exists.');
      // return res.redirect('/signup');
      errors.push('User Already Exists');
    }
    console.log(errors);

    // Check if the email already exists

    if (!reg_pwd.test(password)) {
      // req.flash('infoErrors', 'Password should contain at least 8 characters including one lowercase letter, one uppercase letter, one digit, one special character.');
      // return res.redirect('/signup');
      errors.push('Password should contain at least 8 characters including one lowercase letter, one uppercase letter, one digit, one special character.')
    }
    if (password != confirm_password) {
      // req.flash('infoErrors', 'Password and confirm password do not match.');
      // return res.redirect('/signup');
      errors.push('Password and confirm password do not match.');
    }
    console.log(errors);
    if (errors.length > 0) {
      req.flash('infoErrors', errors);
      console.log(errors);
      return res.redirect('/signup');
    }


    user = new User({
      username,
      email,
      password,
      role,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    req.flash('infoSubmit', 'User has been registered. Login to continue. ')
    res.redirect('/signup');

  } catch (err) {
    req.flash('infoErrors', err);
    console.log(err);
    return res.status(500).redirect('/signup');
  }
};

/*
Login Form
*/
exports.login = async (req, res) => {
  const infoErrorsObject = req.flash('infoErrorslogin');
  const infoSubmitObject = req.flash('infoSubmitlogin');

  res.render('login', { infoErrorsObject, infoSubmitObject })
}

// Login Function

exports.loginnew = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  const { email, password } = req.body;

  try {

    if (!email || !password) {
      // Data is missing, set a flash message and redirect
      req.flash('infoErrorslogin', 'Please fill in all the required fields.');
      return res.redirect('/login');
    }
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('infoErrorslogin', 'User does not exist.');
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash('infoErrorslogin', 'Invalid Password');
      return res.redirect('/login');
    }

      console.log(user);
      const userid = user._id;
      console.log(user._id);
      req.session.uid = user._id;
     req.session.isAuth = true;
     req.flash('infoSubmitlogin', 'User has been logged in.')

    if (user.role === 'vendor') {
      return res.render('addeditvendor', {userid: userid, ErrorData: null, SubmitData: null, WarningData: null });
    }

    else {
      return res.redirect('/');
    }


  } catch (err) {
    console.error(err.message);
    return res.status(500).redirect('/login');
  }
};

/*
Logout Function
*/

exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    console.log("logout");
    return res.redirect('/');
  } catch (err) {
    console.log("logout failed");
    return res.redirect('/');
  }
};
// /**
//  * POST /
//  * user registration
// // */
// exports.registerUserOnPost = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email })
//     var reg_pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,}$/;

//     if (user) {
//       req.flash('infoErrors', 'User already exists.');
//       res.redirect('/signup');
//     }
//     if (!reg_pwd.test(req.body.password)) {
//       req.flash('infoErrors', 'Password should contain at least 8 characters including one lowercase letter, one uppercase letter, one digit, one special character.');
//       res.redirect('/signup');
//     }
//     if (req.body.password != req.body.confirm_password) {
//       req.flash('infoErrors', 'Password and confirm password do not match.');
//       res.redirect('/signup');
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashedPassword
//     });

//     await newUser.save();

//     console.log("posted");
//     console.log(hashedPassword);
//     // req.session.user = {id: newUser._id , name: newUser.name};

//     req.flash('infoSubmit', 'User has been registered.')
//     res.redirect('/');
//   } catch (error) {
//     req.flash('infoErrors', error);
//     res.redirect('/signup');
//   }
// }

/**------------------------------------------------------venue------------------------------------------------------ */


/**
 * GET / venue
 * venues
*/
exports.exploreVenues = async (req, res) => {
  try {
    const queryObj = {}
    const searchInput = null;
    // Handle budget range filtering
    if (req.query.guests) {
      const guestsRange = req.query.guests.split('-');
      const minAmount = parseInt(guestsRange[0]);
      const maxAmount = parseInt(guestsRange[1]);

      // Create budgetObject based on input conditions
      const guestsObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        guestsObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        guestsObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        guestsObject.$gte = minAmount;
        guestsObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.guests = guestsObject;
    }

    if (req.query.starting_price) {
      const priceRange = req.query.starting_price.split('-');
      const minAmount = parseInt(priceRange[0]);
      const maxAmount = parseInt(priceRange[1]);

      // Create budgetObject based on input conditions
      const priceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        priceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        priceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        priceObject.$gte = minAmount;
        priceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.starting_price = priceObject;
    }

    // Handle room price range filtering
    // if (req.query.room_start_price) {
    //   const roomPriceRange = req.query.room_start_price.split('-');
    //   const minAmount = parseInt(roomPriceRange[0]);
    //   const maxAmount = parseInt(roomPriceRange[1]);

    //   // Create budgetObject based on input conditions
    //   const roomPriceObject = {};

    //   // If only gte value is given
    //   if (minAmount && !maxAmount) {
    //     roomPriceObject.$gte = minAmount;
    //   }

    //   // If only lte value is given
    //   if (!minAmount && maxAmount) {
    //     roomPriceObject.$lte = maxAmount;
    //   }

    //   // If a range value is given (both gte and lte values are available)
    //   if (minAmount && maxAmount) {
    //     roomPriceObject.$gte = minAmount;
    //     roomPriceObject.$lte = maxAmount;
    //   }

    //   // Add budgetObject to the query object
    //   queryObj.room_start_price = roomPriceObject;
    // }
  //   if (req.body.room_start_price) {
  //     const priceRange = req.body.room_start_price.split('-');
  //     if (priceRange.length === 2) {
  //         queryObj.room_start_price = {
  //             $gte: parseInt(priceRange[0]),
  //             $lte: parseInt(priceRange[1])
  //         };
  //     } else if (priceRange[0] === 'lte') {
  //         queryObj.room_start_price = { $lte: parseInt(priceRange[1]) };
  //     } else if (priceRange[1] === 'gte') {
  //         queryObj.room_start_price = { $gte: parseInt(priceRange[0]) };
  //     }
  // }
    
    // Handle room count range filtering
    if (req.query.room_count) {
      const roomCountRange = req.query.room_count.split('-');
      const minAmount = parseInt(roomCountRange[0]);
      const maxAmount = parseInt(roomCountRange[1]);

      // Create budgetObject based on input conditions
      const roomCountObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        roomCountObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        roomCountObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        roomCountObject.$gte = minAmount;
        roomCountObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.room_count = roomCountObject;
    }

    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }

    // Handle space filtering
    if (req.query.space) {
      // Use regular expression with 'i' flag for case-insensitive search
      queryObj.space = new RegExp(req.query.space, 'i');
    }

    // Handle venue type filtering
    if (req.query.venue_type) {
      queryObj.venue_type = new RegExp(req.query.venue_type, 'i');
    }
  

    await Venue.find(queryObj).then(venues => {
      res.render('venues',
        {
          searchInput: searchInput,
          venueList: venues
        })
    })
  }

  catch (error) {
    res.status(500).send(error)
  }
}


exports.searchVenue = async (req, res) => {
  try {
    const queryObj = {}
    const searchInput = req.params.searchInput;
    console.log(req.params.searchInput)
    if (req.params.searchInput) {
      const searchTerm = req.params.searchInput;
      const regex = new RegExp(searchTerm, 'i');
      queryObj.$or = [
        { name: regex },
        { location: regex },
        // Search in the 'name' field
        // Add more fields for search if necessary
      ];
    }
    // Handle budget range filtering
    if (req.query.guests) {
      const guestsRange = req.query.guests.split('-');
      const minAmount = parseInt(guestsRange[0]);
      const maxAmount = parseInt(guestsRange[1]);

      // Create budgetObject based on input conditions
      const guestsObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        guestsObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        guestsObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        guestsObject.$gte = minAmount;
        guestsObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.guests = guestsObject;
    }

    if (req.query.starting_price) {
      const priceRange = req.query.starting_price.split('-');
      const minAmount = parseInt(priceRange[0]);
      const maxAmount = parseInt(priceRange[1]);

      // Create budgetObject based on input conditions
      const priceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        priceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        priceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        priceObject.$gte = minAmount;
        priceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.starting_price = priceObject;
    }

    // Handle room price range filtering
    // if (req.query.room_start_price) {
    //   const roomPriceRange = req.query.room_start_price.split('-');
    //   const minAmount = parseInt(roomPriceRange[0]);
    //   const maxAmount = parseInt(roomPriceRange[1]);

    //   // Create budgetObject based on input conditions
    //   const roomPriceObject = {};

    //   // If only gte value is given
    //   if (minAmount && !maxAmount) {
    //     roomPriceObject.$gte = minAmount;
    //   }

    //   // If only lte value is given
    //   if (!minAmount && maxAmount) {
    //     roomPriceObject.$lte = maxAmount;
    //   }

    //   // If a range value is given (both gte and lte values are available)
    //   if (minAmount && maxAmount) {
    //     roomPriceObject.$gte = minAmount;
    //     roomPriceObject.$lte = maxAmount;
    //   }

    //   // Add budgetObject to the query object
    //   queryObj.room_start_price = roomPriceObject;
    // }

    // Handle room count range filtering
    if (req.query.room_count) {
      const roomCountRange = req.query.room_count.split('-');
      const minAmount = parseInt(roomCountRange[0]);
      const maxAmount = parseInt(roomCountRange[1]);

      // Create budgetObject based on input conditions
      const roomCountObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        roomCountObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        roomCountObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        roomCountObject.$gte = minAmount;
        roomCountObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.room_count = roomCountObject;
    }

    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
     // Handle space filtering
     if (req.query.space) {
      // Use regular expression with 'i' flag for case-insensitive search
      queryObj.space = new RegExp(req.query.space, 'i');
    }

    // Handle venue type filtering
    if (req.query.venue_type) {
      queryObj.venue_type = new RegExp(req.query.venue_type, 'i');
    }
    await Venue.find(queryObj).then(venues => {
      res.render('venues', { searchInput: searchInput, venueList: venues });
    })
  }
  catch (err) {

  }
}

exports.eventVenue = async (req, res) => {
  try {
    const queryObj = {}
    const events = req.params.events;
    const searchInput = null;
    console.log(req.params.events)
    if (req.params.events) {
      // Handle services filtering
      const services = req.params.events.split(','); // assuming services are comma-separated
      queryObj.services = { $in: services };
    }

    // Handle budget range filtering
    if (req.query.guests) {
      const guestsRange = req.query.guests.split('-');
      const minAmount = parseInt(guestsRange[0]);
      const maxAmount = parseInt(guestsRange[1]);

      // Create budgetObject based on input conditions
      const guestsObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        guestsObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        guestsObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        guestsObject.$gte = minAmount;
        guestsObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.guests = guestsObject;
    }

    if (req.query.starting_price) {
      const priceRange = req.query.starting_price.split('-');
      const minAmount = parseInt(priceRange[0]);
      const maxAmount = parseInt(priceRange[1]);

      // Create budgetObject based on input conditions
      const priceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        priceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        priceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        priceObject.$gte = minAmount;
        priceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.starting_price = priceObject;
    }

    // Handle room price range filtering
    // if (req.query.room_start_price) {
    //   const roomPriceRange = req.query.room_start_price.split('-');
    //   const minAmount = parseInt(roomPriceRange[0]);
    //   const maxAmount = parseInt(roomPriceRange[1]);

    //   // Create budgetObject based on input conditions
    //   const roomPriceObject = {};

    //   // If only gte value is given
    //   if (minAmount && !maxAmount) {
    //     roomPriceObject.$gte = minAmount;
    //   }

    //   // If only lte value is given
    //   if (!minAmount && maxAmount) {
    //     roomPriceObject.$lte = maxAmount;
    //   }

    //   // If a range value is given (both gte and lte values are available)
    //   if (minAmount && maxAmount) {
    //     roomPriceObject.$gte = minAmount;
    //     roomPriceObject.$lte = maxAmount;
    //   }

    //   // Add budgetObject to the query object
    //   queryObj.room_start_price = roomPriceObject;
    // }

    // Handle room count range filtering
    if (req.query.room_count) {
      const roomCountRange = req.query.room_count.split('-');
      const minAmount = parseInt(roomCountRange[0]);
      const maxAmount = parseInt(roomCountRange[1]);

      // Create budgetObject based on input conditions
      const roomCountObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        roomCountObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        roomCountObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        roomCountObject.$gte = minAmount;
        roomCountObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.room_count = roomCountObject;
    }

    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
     // Handle space filtering
     if (req.query.space) {
      // Use regular expression with 'i' flag for case-insensitive search
      queryObj.space = new RegExp(req.query.space, 'i');
    }

    // Handle venue type filtering
    if (req.query.venue_type) {
      queryObj.venue_type = new RegExp(req.query.venue_type, 'i');
    }

    await Venue.find(queryObj).then(venues => {
      res.render('venues', { searchInput: searchInput, venueList: venues });
    })
  }
  catch (err) {

  }
}

/**
 * GET /venues/:id
 * Venue 
*/
exports.exploreVenue = async (req, res) => {
  try {
    let venueId = req.params.id;
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    await Venue.findById(venueId).then(venue => {
      const ratings = venue.ratings;
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const avgRatingUnRounded = Math.round((totalRatings / ratings.length) * 10) / 10;
      const avgRating = avgRatingUnRounded.toFixed(1);
      res.render('venue_details', { venue: venue, avgRating: avgRating, infoErrorsObj, infoSubmitObj });
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * POST / venue / :id
 * rate photographer
*/
exports.rateVenue = async (req, res) => {
  try {
    const venueId = req.params.id
    const venue = await Venue.findById(venueId);
    const rating = req.body.rating;
    const ratings = { user_id: "pqr", rate: rating }
    venue.ratings.push(ratings)
    venue.save();

    const rates = venue.ratings;
    const totalRatings = rates.reduce((sum, rating) => sum + rating.rate, 0);
    const avgRatingUnRounded = Math.round((totalRatings / rates.length) * 10) / 10;
    const avgRating = avgRatingUnRounded.toFixed(1);
    console.log(avgRating) 

    await Venue.findOneAndUpdate({ _id: venueId }, { 
      $set: {
        averageRating: avgRating
      }
    })

    res.redirect("/venues/" + `${venueId}`);
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" })
  }
}


exports.enquireVenue = async (req, res) => {
  const venueId = req.params.id;
  try {
    
    const contact = req.body.contact;
    console.log(contact)
    var contact_regex = /^\d{10}$/;
    if (!contact_regex.test(contact)) {
      req.flash('infoErrors',[{ message: 'Invalid contact number' }]);
      return res.redirect("/venues/" + `${venueId}`)
    }
    req.flash('infoSubmit', [{message : 'Enquiry sent successfully!'}])
    res.redirect("/venues/" + `${venueId}`);
  }
  catch (error) {
    req.flash('infoErrors', error);
    res.redirect("/venues/" + `${venueId}`);
  }
}

/**
 * GET /register-venue
 * venue-registration 
*/
exports.registerVenue = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');
  // res.render('venue_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj });


  const userid = req.params.id;
  const user = await Venue.findOne({ userid });
  if (user) {
    req.flash('warndata', 'Venue already exists with this account , To add new , create new Account !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: null, WarningData: WarningData });
  }

  return res.render('venue_details_form', { title: 'Dream Stories - Organisation Registration ', userid: userid, infoErrorsObj, infoSubmitObj, userid: userid });
}


/**
 * POST /register-venue
 * register on post
*/

exports.registerVenueOnPost = async (req, res) => {
  const userid = req.params.id;
  try {
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let portfolioPhotos = [];
    let newPortfolioName;
    let uploadPortfolioPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    }
    if (req.files && req.files.image) {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })
    }
    if (req.files && req.files.photos) {
      let uploadedPhotos = req.files.photos;

      if (!Array.isArray(uploadedPhotos)) {
        // If only one file is uploaded, wrap it in an array for consistency
        uploadedPhotos = [uploadedPhotos];
      }

      for (const photo of uploadedPhotos) {
        if (photo && photo.name) {
          newPortfolioName = Date.now() + photo.name;
          uploadPortfolioPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

          photo.mv(uploadPortfolioPath, function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

          portfolioPhotos.push({ url: newPortfolioName });
        }
      }
    } else {
      console.log('No photos were uploaded.');
    }

    const food_types = Array.isArray(req.body.food_type) ? req.body.food_type : [req.body.food_type];
    const food_prices = Array.isArray(req.body.food_price) ? req.body.food_price : [req.body.food_price];

    const foods = [];

    for (let i = 0; i < Math.max(food_types.length, food_prices.length); i++) {
      const foodType = food_types[i] || ''; // Use empty string if package name doesn't exist
      const foodPrice = food_prices[i] || 0; // Use 0 if package price doesn't exist
      foods.push({ food_type: foodType, food_price: foodPrice });
    }

    const hall_names = Array.isArray(req.body.hall_name) ? req.body.hall_name : [req.body.hall_name];
    const hall_spaces = Array.isArray(req.body.hall_space) ? req.body.hall_space : [req.body.hall_space];
    const hall_seatings = Array.isArray(req.body.hall_seating) ? req.body.hall_seating : [req.body.hall_seating];
    const hall_floatings = Array.isArray(req.body.hall_floating) ? req.body.hall_floating : [req.body.hall_floating];
    const hall_prices = Array.isArray(req.body.hall_price) ? req.body.hall_price : [req.body.hall_price];

    const halls = [];

    for (let i = 0; i < Math.max(hall_names.length, hall_spaces.length, hall_seatings.length, hall_floatings.length, hall_prices.length); i++) {
      const hallName = hall_names[i] || ''; // Use empty string if package name doesn't exist
      const hallSpace = hall_spaces[i] || '';
      const hallSeating = hall_seatings[i] || 0;
      const hallFloating = hall_floatings[i] || 0;
      const hallPrice = hall_prices[i] || 0; // Use 0 if package price doesn't exist
      halls.push({ hall_name: hallName, hall_space: hallSpace, hall_seating: hallSeating, hall_floating: hallFloating, hall_price: hallPrice });
    }


    const events = Array.isArray(req.body.event) ? req.body.event : [req.body.event];
    const decor_prices = Array.isArray(req.body.decor_price) ? req.body.decor_price : [req.body.decor_price];

    const decors = [];

    for (let i = 0; i < Math.max(events.length, decor_prices.length); i++) {
      const event = events[i] || ''; // Use empty string if package name doesn't exist
      const decorPrice = decor_prices[i] || 0; // Use 0 if package price doesn't exist
      decors.push({ event: event, decor_price: decorPrice });
    }

    const room_names = Array.isArray(req.body.room_name) ? req.body.room_name : [req.body.room_name];
    const room_prices = Array.isArray(req.body.room_price) ? req.body.room_price : [req.body.room_price];

    const rooms = [];

    for (let i = 0; i < Math.max(room_names.length, room_prices.length); i++) {
      const roomName = room_names[i] || ''; // Use empty string if package name doesn't exist
      const roomPrice = room_prices[i] || 0; // Use 0 if package price doesn't exist
      rooms.push({ room_name: roomName, room_price: roomPrice });
    }

    const newVenue = new Venue({
      userid: userid,
      name: req.body.name,
      address: req.body.address,
      location: req.body.location,
      addressUrl: req.body.addressUrl,
      about: req.body.about,
      contact: req.body.contact,
      email: req.body.email,
      services: req.body.services,
      since: req.body.since,
      venue_type: req.body.venue_type,
      eventsManaged: req.body.eventsManaged,
      parking: req.body.parking,
      smallpartyvenue: req.body.small_party,
      features: req.body.features,
      space: req.body.space,
      starting_price: req.body.starting_price,
      room_start_price: req.body.room_start_price,
      room_count: req.body.room_count,
      guests: req.body.guests,
      catering_policy: req.body.catering,
      decor_policy: req.body.decor,
      outside_alcohol: req.body.alcohol,
      dj_policy: req.body.dj,
      instaUrl: req.body.instaUrl,
      fbUrl: req.body.fbUrl,
      profilePhoto: newImageName,
      portfolioPhotos: portfolioPhotos
    });

    newVenue.food_price = foods;
    newVenue.halls = halls;
    newVenue.rooms = rooms;
    newVenue.decor = decors;
    await newVenue.save();

    req.flash('subdata', 'Organisation has been registered.')
    res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  } catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/register-venue/'+ `${userid}`);
  }
}



/**
 * GET /venues/edit/:id
 * photographer-packages
*/
exports.venuesEdit = async (req, res) => { 
  const userid = req.params.id;
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
   

    const venue = await Venue.findOne({ userid });
    console.log(venue)
    if (!venue) {
      req.flash('errordata', 'No such User Exists as Venue Provider !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }
    res.render('venue_edit', { userid: userid, venue, infoErrorsObj, infoSubmitObj })

  }
  catch (error) {
    req.flash('errordata', 'Error Occured !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }
}

/** 
 * POST /venues/edit/:id
 * photographer-updation
*/

exports.venuesEditPost = async (req, res) => {
  const userid = req.params.id;
  try {
    
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let portfolioPhotos = [];
    let newPortfolioName;
    let uploadPortfolioPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } if (req.files && req.files.image) {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }
    if (req.files && req.files.photos) {
      let uploadedPhotos = req.files.photos;

      if (!Array.isArray(uploadedPhotos)) {
        // If only one file is uploaded, wrap it in an array for consistency
        uploadedPhotos = [uploadedPhotos];
      }

      for (const photo of uploadedPhotos) {
        if (photo && photo.name) {
          newPortfolioName = Date.now() + photo.name;
          uploadPortfolioPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

          photo.mv(uploadPortfolioPath, function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

          portfolioPhotos.push({ url: newPortfolioName });
        }
      }
    } else {
      console.log('No photos were uploaded.');
    }


    const food_types = Array.isArray(req.body.food_type) ? req.body.food_type : [req.body.food_type];
    const food_prices = Array.isArray(req.body.food_price) ? req.body.food_price : [req.body.food_price];

    const foods = [];

    for (let i = 0; i < Math.max(food_types.length, food_prices.length); i++) {
      const foodType = food_types[i] || ''; // Use empty string if package name doesn't exist
      const foodPrice = food_prices[i] || 0; // Use 0 if package price doesn't exist
      foods.push({ food_type: foodType, food_price: foodPrice });
    }


    const hall_names = Array.isArray(req.body.hall_name) ? req.body.hall_name : [req.body.hall_name];
    const hall_spaces = Array.isArray(req.body.hall_space) ? req.body.hall_space : [req.body.hall_space];
    const hall_seatings = Array.isArray(req.body.hall_seating) ? req.body.hall_seating : [req.body.hall_seating];
    const hall_floatings = Array.isArray(req.body.hall_floating) ? req.body.hall_floating : [req.body.hall_floating];
    const hall_prices = Array.isArray(req.body.hall_price) ? req.body.hall_price : [req.body.hall_price];
    const halls = [];
    for (let i = 0; i < Math.max(hall_names.length, hall_prices.length); i++) {
      const hallName = hall_names[i] || ''; // Use empty string if package name doesn't exist
      const hallSpace = hall_spaces[i] || '';
      const hallSeating = hall_seatings[i] || 0;
      const hallFloating = hall_floatings[i] || 0;
      const hallPrice = hall_prices[i] || 0; // Use 0 if package price doesn't exist
      halls.push({ hall_name: hallName, hall_space: hallSpace, hall_seating: hallSeating, hall_floating: hallFloating, hall_price: hallPrice });
    }

    const events = Array.isArray(req.body.event) ? req.body.event : [req.body.event];
    const decor_prices = Array.isArray(req.body.decor_price) ? req.body.decor_price : [req.body.decor_price];
    const decors = [];
    for (let i = 0; i < Math.max(events.length, decor_prices.length); i++) {
      const event = events[i] || ''; // Use empty string if package name doesn't exist
      const decorPrice = decor_prices[i] || 0; // Use 0 if package price doesn't exist
      decors.push({ event: event, decor_price: decorPrice });
    }

    const room_names = Array.isArray(req.body.room_name) ? req.body.room_name : [req.body.room_name];
    const room_prices = Array.isArray(req.body.room_price) ? req.body.room_price : [req.body.room_price];
    const rooms = [];
    for (let i = 0; i < Math.max(room_names.length, room_prices.length); i++) {
      const roomName = room_names[i] || ''; // Use empty string if package name doesn't exist
      const roomPrice = room_prices[i] || 0; // Use 0 if package price doesn't exist
      rooms.push({ room_name: roomName, room_price: roomPrice });
    }

    console.log(req.params.id)

    const venue = await Venue.findOneAndUpdate({ userid: userid }, {
      $set: {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        addressUrl: req.body.addressUrl,
        about: req.body.about,
        contact: req.body.contact,
        email: req.body.email,
        services: req.body.services,
        since: req.body.since,
        venue_type: req.body.venue_type,
        eventsManaged: req.body.eventsManaged,
        parking: req.body.parking,
        smallpartyvenue: req.body.small_party,
        features: req.body.features,
        space: req.body.space,
        starting_price: req.body.starting_price,
        room_start_price: req.body.room_start_price,
        room_count: req.body.room_count,
        guests: req.body.guests,
        catering_policy: req.body.catering,
        decor_policy: req.body.decor,
        outside_alcohol: req.body.alcohol,
        dj_policy: req.body.dj,
        food_price: foods,
        halls: halls,
        rooms: rooms,
        decor: decors,
        instaUrl: req.body.instaUrl,
        fbUrl: req.body.fbUrl,
        profilePhoto: newImageName,
        portfolioPhotos: portfolioPhotos
      }
    },
      { upsert: true, new: true }
    )
    console.log('Foods:', foods);
    console.log('Halls:', halls);
    console.log('Decors:', decors);
    console.log('Rooms:', rooms);
    console.log(venue);

    venue.save();
    req.flash('infoSubmit', 'Venue Updated!')
    res.redirect('/venues/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


exports.addVenueServices = async (req, res) => {
   const userid = req.params.id;
  try {
   
    const venue = await Venue.findOne({userid});
    res.render('addVenueService', { venue })
  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


exports.delVenueService = async (req, res) => {  
  const userid = req.params.id;
  try {
  
    const service = req.params.service;
    const venue = await Venue.findOne({userid});

    venue.services.pull(service)

    await venue.save();

    req.flash('infoSubmit', 'Service Deleted!')
    res.redirect('/venues/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


exports.addVenueServicesOnPost = async (req, res) => {
  const userid = req.params.id;
  try {
    

    await Venue.findOneAndUpdate(
      { userid },
      {
        $push: {
          services: {
            $each: req.body.services
          }
        }
      }
    );

    req.flash('infoSubmit', 'Service/s Added!')
    res.redirect('/venues/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


/**
 * GET /venues/add-hall/:id
 * photographer-add-halls
*/
exports.addVenueHall = async (req, res) => {
  const userid = req.params.id;
  try{
  const venue = await Venue.findOne({ userid })
  res.render('addVenueHalls', { venue })}
  catch(error){
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}

/**
 * POST /venues/add-hall/:id
 * photographer-add-halls
*/
exports.addVenueHallOnPost = async (req, res) => { 
  const userid = req.params.id;
  try {
   
    const { hall_name, hall_space, hall_seating, hall_floating, hall_price } = req.body;

    const hallsToAdd = [];

    if (!Array.isArray(hall_name)) {
      // If package_name is not an array, convert it into an array
      hallsToAdd.push({ hall_name, hall_space: hall_space || '', hall_seating: hall_seating || 0, hall_floating: hall_floating || 0, hall_price: hall_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < hall_name.length; i++) {
        const hallName = hall_name[i];
        const hallSpace = hall_space || '';
        const hallSeating = hall_seating || 0;
        const hallFloating = hall_floating || 0;
        const hallPrice = hall_price[i] || 0;
        hallsToAdd.push({ hall_name: hallName, hall_space: hallSpace, hall_seating: hallSeating, hall_floating: hallFloating, hall_price: hallPrice });
      }
    }

    await Venue.findOneAndUpdate(
      { userid },
      {
        $push: {
          halls: {
            $each: hallsToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Hall Added!')
    res.redirect('/venues/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


/**
 * POST /venues/del-hall/:id/:pid
 * photographer-hall-delete
*/
exports.delVenueHall = async (req, res) => { 
  const userid = req.params.id;
  try {
   
    const hallId = req.params.pid;
    const venue = await Venue.findOne({ userid });

    venue.halls.pull(hallId)

    await venue.save()

    req.flash('infoSubmit', 'Hall deleted successfully.')
    res.redirect('/venues/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


/**
 * GET /venues/add-room/:id
 * photographer-add-rooms
*/
exports.addVenueRoom = async (req, res) => {
  const userid = req.params.id;
  try{
  
  const venue = await Venue.findOne({ userid })
  res.render('addVenueRooms', { venue })}
  catch(error){
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}

/**
 * POST /venues/add-room/:id
 * photographer-add-rooms
*/
exports.addVenueRoomOnPost = async (req, res) => {
  const userid = req.params.id;
  try {
    
    const { room_name, room_price } = req.body;

    const roomsToAdd = [];

    if (!Array.isArray(room_name)) {
      // If package_name is not an array, convert it into an array
      roomsToAdd.push({ room_name, room_price: room_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < room_name.length; i++) {
        const roomName = room_name[i];
        const roomPrice = room_price[i] || 0;
        roomsToAdd.push({ room_name: roomName, room_price: roomPrice });
      }
    }

    await Venue.findOneAndUpdate(
      { userid },
      {
        $push: {
          rooms: {
            $each: roomsToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Room Added!')
    res.redirect('/venues/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


/**
 * POST /venues/del-room/:id/:pid
 * photographer-rooms-delete
*/
exports.delVenueRoom = async (req, res) => { 
  const userid = req.params.id;
  try {
   
    const roomId = req.params.pid;
    const venue = await Venue.findOne({ userid });

    venue.rooms.pull(roomId)

    await venue.save();

    req.flash('infoSubmit', 'Room deleted successfully.')
    res.redirect('/venues/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}



/**
 * GET /venues/add-food/:id
 * photographer-add-food
*/
exports.addVenueFood= async (req, res) => {
  const userid = req.params.id;
  try{
  
  const venue = await Venue.findOne({ userid })
  res.render('addVenueFood', { venue })}
  catch(error){
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}

/**
 * POST /venues/add-food/:id
 * photographer-add-food
*/
exports.addVenueFoodOnPost = async (req, res) => {
  const userid = req.params.id;
  try {
    
    const { food_type, food_price } = req.body;

    const foodsToAdd = [];

    if (!Array.isArray(food_type)) {
      // If package_name is not an array, convert it into an array
      foodsToAdd.push({ food_type, food_price: food_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < food_type.length; i++) {
        const foodName = food_type[i];
        const foodPrice = food_price[i] || 0;
        foodsToAdd.push({ food_type: foodName, food_price: foodPrice });
      }
    }

    await Venue.findOneAndUpdate(
      { userid },
      {
        $push: {
          food_price: {
            $each: foodsToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Food Added!')
    res.redirect('/venues/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


/**
 * POST /venues/del-room/:id/:pid
 * photographer-rooms-delete
*/
exports.delVenueFood = async (req, res) => { 
  const userid = req.params.id;
  try {
   
    const foodId = req.params.pid;
    const venue = await Venue.findOne({ userid });

    venue.food_price.pull(foodId)

    await venue.save();

    req.flash('infoSubmit', 'Food deleted successfully.')
    res.redirect('/venues/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}

/**
 * GET /venues/add-decor/:id
 * photographer-add-decor
*/
exports.addVenueDecor = async (req, res) => {
  const userid = req.params.id;
  try{
  const venue = await Venue.findOne({ userid })
  res.render('addVenueDecor', { venue })}
  catch(error){
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}

/**
 * POST /venues/add-package/:id
 * photographer-add-halls
*/
exports.addVenueDecorOnPost = async (req, res) => {
    const userid = req.params.id;
  try {
  
    const { event, decor_price } = req.body;

    const decorsToAdd = [];

    if (!Array.isArray(event)) {
      // If package_name is not an array, convert it into an array
      decorsToAdd.push({ event, decor_price: decor_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < event.length; i++) {
        const event = event[i];
        const decorPrice = decor_price[i] || 0;
        decorsToAdd.push({ event: event, decor_price: decorPrice });
      }
    }

    await Venue.findOneAndUpdate(
      { userid },
      {
        $push: {
          decor: {
            $each: decorsToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Decoration price Added!')
    res.redirect('/venues/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}


/**
 * POST /venues/del-package/:id/:pid
 * photographer-packages-delete
*/
exports.delVenueDecor = async (req, res) => { 
  const userid = req.params.id;
  try {
   
    const decorId = req.params.pid;
    const venue = await Venue.findOne({ userid });

    venue.decor.pull(decorId)

    await venue.save();

    req.flash('infoSubmit', 'Decoration price deleted successfully.')
    res.redirect('/venues/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/venues/edit/'+ `${userid}`);
  }
}

/**
 * POST /delete-venue/:id
 * photographer-delete
*/
exports.deleteVenue = async (req, res) => {
  const userid = req.params.id;
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');

  try {
    const result = await Venue.findOne({ userid });

    if (!result) {
      req.flash('errordata', 'No User Found as Venue Provider !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }

    await Venue.deleteOne({ userid });
    req.flash('subdata', 'Venue Provider Deleted Successfully !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });

  } catch (error) {
    console.log(error);
    req.flash('errordata', 'Error Occurred While Deleting Venue Provider!!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }
}




/**---------------------------------------------------------photographer------------------------------------------------------ */

/**
 * GET / photographer
 * 
*/
exports.explorePhotographers = async (req, res) => {
  try {
    const queryObj = {}
    const searchInput = null;
    // Handle budget range filtering
    if (req.query.photoVideo) {
      const budgetRange = req.query.photoVideo.split('-');
      const minAmount = parseInt(budgetRange[0]);
      const maxAmount = parseInt(budgetRange[1]);

      // Create budgetObject based on input conditions
      const budgetObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        budgetObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        budgetObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        budgetObject.$gte = minAmount;
        budgetObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.photoVideo = budgetObject;
    }
    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
    // if (req.query.services) {
    //   const services = req.query.services.split(','); // assuming services are comma-separated
    //   queryObj.services = { $in: services };
    // }

    // Handle events type filtering
    if (req.query.services_offer) {
      queryObj.services_offer = new RegExp(req.query.services_offer, 'i');
    }

    await Photographer.find(queryObj).then(photographers => {
      res.render('photographers',
        {
          searchInput: searchInput,
          photographerList: photographers
        })
    })
  }

  catch (error) {
    res.status(500).send(error)
  }
}


exports.searchPhotographer = async (req, res) => {
  try {
    const queryObj = {}
    const searchInput = req.params.searchInput;
    console.log(req.params.searchInput)
    if (req.params.searchInput) {
      const searchTerm = req.params.searchInput;
      const regex = new RegExp(searchTerm, 'i');
      queryObj.$or = [
        { name: regex },
        { address: regex },
        // Search in the 'name' field
        // Add more fields for search if necessary
      ];
    }
    // Handle budget range filtering
    if (req.query.photoVideo) {
      const budgetRange = req.query.photoVideo.split('-');
      const minAmount = parseInt(budgetRange[0]);
      const maxAmount = parseInt(budgetRange[1]);

      // Create budgetObject based on input conditions
      const budgetObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        budgetObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        budgetObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        budgetObject.$gte = minAmount;
        budgetObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.photoVideo = budgetObject;
    }
    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
    if (req.query.services_offer) {
      queryObj.services_offer = new RegExp(req.query.services_offer, 'i');
    }

    await Photographer.find(queryObj).then(photographers => {
      res.render('photographers', { searchInput: searchInput, photographerList: photographers });
    })
  }
  catch (err) {

  }
}

/**
 * GET /photographers/:id
 * Photographer
*/
exports.explorePhotographer = async (req, res) => {
  try {
    let photographerId = req.params.id;
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    await Photographer.findById(photographerId).then(photographer => {
      const ratings = photographer.ratings;
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const avgRatingUnRounded = Math.round((totalRatings / ratings.length) * 10) / 10;
      const avgRating = avgRatingUnRounded.toFixed(1);
      res.render('photographer_details', { photographer: photographer, avgRating: avgRating, infoErrorsObj, infoSubmitObj });
    });
  } catch (error) {
    res.sttatus(500).send({ message: error.message || "Error Occured" });
  }
}

/**
 * POST / /photographer/:id
 * rate photographer
*/
exports.ratePhotographer = async (req, res) => {
  try {
    const photographerId = req.params.id
    const photographer = await Photographer.findById(photographerId);
    const rating = req.body.rating;
    const ratings = { user_id: "pqr", rate: rating }
    photographer.ratings.push(ratings)
    photographer.save();

    const rates = photographer.ratings;
    const totalRatings = rates.reduce((sum, rating) => sum + rating.rate, 0);
    const avgRatingUnRounded = Math.round((totalRatings / rates.length) * 10) / 10;
    const avgRating = avgRatingUnRounded.toFixed(1);
    console.log(avgRating)

    await Photographer.findOneAndUpdate({ _id: photographerId }, {
      $set: {
        averageRating: avgRating
      }
    })

    console.log(photographer)
    console.log("rated")
    res.redirect("/photographers/" + `${photographerId}`);
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" })
  }
}



exports.enquirePhotographer = async (req, res) => {
  const photographerId = req.params.id;
  try {
    const contact = req.body.contact;
    console.log(contact)
    var contact_regex = /^\d{10}$/;
    if (!contact_regex.test(contact)) {
      req.flash('infoErrors',[{ message: 'Invalid contact number' }]);
      return res.redirect("/photographers/" + `${photographerId}`)
    }

    req.flash('infoSubmit', [{message: 'Enquiry sent successfully!'}])
    res.redirect("/photographers/" + `${photographerId}`);
  }
  catch (error) {
    req.flash('infoErrors', error);
    res.redirect("/photographers/" + `${photographerId}`);
  }
}

/**
 * GET /register-photographer
 * photographer-registration
*/
exports.registerPhotographer = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');
  // res.render('venue_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj });


  const userid = req.params.id;
  const user = await Photographer.findOne({ userid });
  if (user) {
    req.flash('warndata', 'Photographer already exists with this account , To add new , create new Account !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: null, WarningData: WarningData });
  }

  return res.render('photographer_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj, userid: userid });
}

/**
 * POST /register-photographer
 * register on post
*/

exports.registerPhotographerOnPost = async (req, res) => { 
   const userid = req.params.id;
  try {
    const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');

    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let portfolioPhotos = [];
    let newPortfolioName;
    let uploadPortfolioPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } if (req.files && req.files.image) {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }
    if (req.files && req.files.photos) {
      let uploadedPhotos = req.files.photos;

      if (!Array.isArray(uploadedPhotos)) {
        // If only one file is uploaded, wrap it in an array for consistency
        uploadedPhotos = [uploadedPhotos];
      }

      for (const photo of uploadedPhotos) {
        if (photo && photo.name) {
          newPortfolioName = Date.now() + photo.name;
          uploadPortfolioPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

          photo.mv(uploadPortfolioPath, function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

          portfolioPhotos.push({ url: newPortfolioName });
        }
      }
    } else {
      console.log('No photos were uploaded.');
    }

    const package_names = Array.isArray(req.body.package_name) ? req.body.package_name : [req.body.package_name];
    const package_prices = Array.isArray(req.body.package_price) ? req.body.package_price : [req.body.package_price];

    const packages = [];

    for (let i = 0; i < Math.max(package_names.length, package_prices.length); i++) {
      const packageName = package_names[i] || ''; // Use empty string if package name doesn't exist
      const packagePrice = package_prices[i] || 0; // Use 0 if package price doesn't exist
      packages.push({ package_name: packageName, package_price: packagePrice });
    }


    const newPhotographer = new Photographer({
      userid: userid,
      name: req.body.name,
      address: req.body.address,
      location: req.body.location,
      addressUrl: req.body.addressUrl,
      about: req.body.about,
      contact: req.body.contact,
      email: req.body.email,
      services_offer: req.body.services_offer,
      services: req.body.services,
      since: req.body.since,
      eventsManaged: req.body.eventsManaged,
      paymentTerms: req.body.payment,
      travelCost: req.body.travel,
      mostBooked: req.body.most_booked,
      deliveryTime: req.body.delivery,
      budget: req.body.budget,
      smallFunction: req.body.smallfunc,
      photo: req.body.photo,
      photoVideo: req.body.photo_vdo,
      albums: req.body.albums,
      instaUrl: req.body.instaUrl,
      fbUrl: req.body.fbUrl,
      profilePhoto: newImageName,
      portfolioPhotos: portfolioPhotos
    });

    newPhotographer.packages = packages;
    await newPhotographer.save();

    req.flash('subdata', 'Photographer Registered!')
    res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  } catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/register-photographer/'+ `${userid}`);
  }
}


/**
 * GET / /photographers/edit/:id
 * photographer-packages
*/
exports.photographersEdit = async (req, res) => { 
  const userid = req.params.id;
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
  
   

    const photographer = await Photographer.findOne({ userid });

    if (!photographer) {
      req.flash('errordata', 'No such User Exists as Photographer !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }
    res.render('photographer_edit', { userid: userid, photographer, infoErrorsObj, infoSubmitObj })

  }
  catch (error) {
    req.flash('errordata', 'Error Occured !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }
}

/**
 * POST /photographers/edit/:id
 * photographer-updation
*/

exports.photographersEditPost = async (req, res) => { 
  const userid = req.params.id;
  try {
   

    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let portfolioPhotos = [];
    let newPortfolioName;
    let uploadPortfolioPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } if (req.files && req.files.image) {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }
    if (req.files && req.files.photos) {
      let uploadedPhotos = req.files.photos;

      if (!Array.isArray(uploadedPhotos)) {
        // If only one file is uploaded, wrap it in an array for consistency
        uploadedPhotos = [uploadedPhotos];
      }

      for (const photo of uploadedPhotos) {
        if (photo && photo.name) {
          newPortfolioName = Date.now() + photo.name;
          uploadPortfolioPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

          photo.mv(uploadPortfolioPath, function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

          portfolioPhotos.push({ url: newPortfolioName });
        }
      }
    } else {
      console.log('No photos were uploaded.');
    }

    const package_names = Array.isArray(req.body.package_name) ? req.body.package_name : [req.body.package_name];
    const package_prices = Array.isArray(req.body.package_price) ? req.body.package_price : [req.body.package_price];

    const packages = [];

    for (let i = 0; i < Math.max(package_names.length, package_prices.length); i++) {
      const packageName = package_names[i] || ''; // Use empty string if package name doesn't exist
      const packagePrice = package_prices[i] || 0; // Use 0 if package price doesn't exist
      packages.push({ package_name: packageName, package_price: packagePrice });
    }


    const photographer = await Photographer.findOneAndUpdate({ userid }, {
      $set: {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        addressUrl: req.body.addressUrl,
        about: req.body.about,
        contact: req.body.contact,
        email: req.body.email,
        services_offer: req.body.services_offer,
        services: req.body.services,
        since: req.body.since,
        eventsManaged: req.body.eventsManaged,
        paymentTerms: req.body.payment,
        travelCost: req.body.travel,
        mostBooked: req.body.most_booked,
        deliveryTime: req.body.delivery,
        budget: req.body.budget,
        smallFunction: req.body.smallfunc,
        photo: req.body.photo,
        photoVideo: req.body.photo_vdo,
        albums: req.body.albums,
        packages: packages,
        instaUrl: req.body.instaUrl,
        fbUrl: req.body.fbUrl,
        profilePhoto: newImageName,
        portfolioPhotos: portfolioPhotos
      }
    },
      { upsert: true, new: true }
    )

    req.flash('infoSubmit', 'Photographer details updated!')
    res.redirect('/photographers/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/photographers/edit/'+ `${userid}`);
  }
}

exports.addPhotographersServices = async (req, res) => {
  const userid = req.params.id;
  try {
    
    const photographer = await Photographer.findOne({userid});
    res.render('addPhotographerServices', { photographer })
  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/photographers/edit/'+ `${userid}`);
  }
}


exports.delPhotographersService = async (req, res) => {
  const userid = req.params.id;
  try {
    
    const service = req.params.service;
    const photographer = await Photographer.findOne({userid});

    photographer.services.pull(service)

    await photographer.save();

    req.flash('infoSubmit', 'Service Deleted!')
    res.redirect('/photographers/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/photographers/edit/'+ `${userid}`);
  }
}


exports.addPhotographersServicesOnPost = async (req, res) => {
   const userid = req.params.id;
  try {

    await Photographer.findOneAndUpdate(
      { userid },
      {
        $push: {
          services: {
            $each: req.body.services
          }
        }
      }
    );

    req.flash('infoSubmit', 'Service/s Added!')
    res.redirect('/photographers/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/photographers/edit/'+ `${userid}`);
  }
}


/**
 * GET /photographers/add-package/:id 
 * photographer-add-packages 
*/
exports.addPhotographersPackages = async (req, res) => {
  const userid = req.params.id;
  try{
  const photographer = await Photographer.findOne({userid})
  res.render('addPhotographerPackage', { photographer })}
  catch(error){
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/photographers/edit/'+ `${userid}`);
  }
}

/**
 * POST /photographers/add-package/:id
 * photographer-add-packages
*/
exports.addPhotographersPackagesOnPost = async (req, res) => {
  const userid = req.params.id;
  try {
    
    const { package_name, package_price } = req.body;

    const packagesToAdd = [];

    if (!Array.isArray(package_name)) {
      // If package_name is not an array, convert it into an array
      packagesToAdd.push({ package_name, package_price: package_price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < package_name.length; i++) {
        const name = package_name[i];
        const price = package_price[i] || 0;
        packagesToAdd.push({ package_name: name, package_price: price });
      }
    }

    await Photographer.findOneAndUpdate(
      { userid },
      {
        $push: {
          packages: {
            $each: packagesToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Pacakge Added!')
    res.redirect('/photographers/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/photographers/edit/'+ `${userid}`);
  }
}


/**
 * POST /photographers/del-package/:id/:pid
 * photographer-packages-delete
*/
exports.delPhotographersPackage = async (req, res) => { const userid = req.params.id;
  try {
   
    const packageId = req.params.pid;
    const photographer = await Photographer.findOne({userid});

    photographer.packages.pull(packageId)

    await photographer.save();

    req.flash('infoSubmit', 'Package deleted successfully!')
    res.redirect('/photographers/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/photographers/edit/'+ `${userid}`);
  }
}


/**
 * POST /delete-photographer/:id
 * photographer-delete
*/
exports.deletePhotographer = async (req, res) => {
  const userid = req.params.id;
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
  
    try {
      const result = await Photographer.findOne({ userid });
  
      if (!result) {
        req.flash('errordata', 'No User Found as Photographer !!');
        return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
      }
  
      await Photographer.deleteOne({ userid });
      req.flash('subdata', 'Photographer Deleted Successfully !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  
    } catch (error) {
      console.log(error);
      req.flash('errordata', 'Error Occurred While Deleting Photographer!!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }
}

/**--------------------------------------------------------entertainer------------------------------------------------------ */


/**
 * GET / entertainers
 * 
*/
exports.exploreEntertainers = async (req, res) => {
  try {
    const queryObj = {}
    const searchInput = null;
    // Handle budget range filtering
    if (req.query.budget) {
      const budgetRange = req.query.budget.split('-');
      const minAmount = parseInt(budgetRange[0]);
      const maxAmount = parseInt(budgetRange[1]);

      // Create budgetObject based on input conditions
      const budgetObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        budgetObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        budgetObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        budgetObject.$gte = minAmount;
        budgetObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.budget = budgetObject;
    }
    // Handle experience filtering
    if (req.query.experience) {
      const experienceRange = req.query.experience.split('-');
      const minAmount = parseInt(experienceRange[0]);
      const maxAmount = parseInt(experienceRange[1]);

      // Create budgetObject based on input conditions
      const experienceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        experienceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        experienceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        experienceObject.$gte = minAmount;
        experienceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.experience = experienceObject;
    }
    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
    // Handle search filtering
    // if (req.query.search) {
    //   const searchTerm = req.query.search;
    //   const regex = new RegExp(searchTerm, 'i');
    //   queryObj.$or = [
    //     { name: regex }, // Search in the 'name' field
    //     { location: regex }
    //   ];
    // }

    // Handle service events filtering
     if (req.query.services) {
       const services = req.query.services.split(','); // assuming services are comma-separated
       queryObj.services = { $in: services };
     }


    await Entertainer.find(queryObj).then(entertainers => {
      res.render('entertainers',
        {
          searchInput: searchInput,
          entertainerList: entertainers
        })
    })
  }

  catch (error) {
    res.status(500).send(error)
  }
}


exports.searchEntertainer = async (req, res) => {
  try {
    const queryObj = {}
    const searchInput = req.params.searchInput;
    console.log(req.params.searchInput)
    if (req.params.searchInput) {
      const searchTerm = req.params.searchInput;
      const regex = new RegExp(searchTerm, 'i');
      queryObj.$or = [
        { name: regex },
        { location: regex },
        // Search in the 'name' field
        // Add more fields for search if necessary
      ];
    }
    // Handle budget range filtering
    if (req.query.budget) {
      const budgetRange = req.query.budget.split('-');
      const minAmount = parseInt(budgetRange[0]);
      const maxAmount = parseInt(budgetRange[1]);

      // Create budgetObject based on input conditions
      const budgetObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        budgetObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        budgetObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        budgetObject.$gte = minAmount;
        budgetObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.budget = budgetObject;
    }
    // Handle experience filtering
    if (req.query.experience) {
      const experienceRange = req.query.experience.split('-');
      const minAmount = parseInt(experienceRange[0]);
      const maxAmount = parseInt(experienceRange[1]);

      // Create budgetObject based on input conditions
      const experienceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        experienceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        experienceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        experienceObject.$gte = minAmount;
        experienceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.experience = experienceObject;
    }
    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }

    // Handle service events filtering
    if (req.query.services) {
      const services = req.query.services.split(','); // assuming services are comma-separated
      queryObj.services = { $in: services };
    }

    await Entertainer.find(queryObj).then(entertainers => {
      res.render('entertainers', { searchInput: searchInput, entertainerList: entertainers });
    })
  }
  catch (err) {

  }
}

exports.eventEntertainer = async (req, res) => {
  try {
    const queryObj = {}
    const events = req.params.events;
    const searchInput = null;
    console.log(req.params.type)
    if (req.params.type) {
      queryObj.entertainer_type = new RegExp(req.params.type, 'i');
    }

    // Handle budget range filtering
    if (req.query.budget) {
      const budgetRange = req.query.budget.split('-');
      const minAmount = parseInt(budgetRange[0]);
      const maxAmount = parseInt(budgetRange[1]);

      // Create budgetObject based on input conditions
      const budgetObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        budgetObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        budgetObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        budgetObject.$gte = minAmount;
        budgetObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.budget = budgetObject;
    }
    // Handle experience filtering
    if (req.query.experience) {
      const experienceRange = req.query.experience.split('-');
      const minAmount = parseInt(experienceRange[0]);
      const maxAmount = parseInt(experienceRange[1]);

      // Create budgetObject based on input conditions
      const experienceObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        experienceObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        experienceObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        experienceObject.$gte = minAmount;
        experienceObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.experience = experienceObject;
    }
    // Handle rating range filtering
    if (req.query.averageRating) {
      const ratingRange = req.query.averageRating.split('-');
      const minAmount = parseInt(ratingRange[0]);
      const maxAmount = parseInt(ratingRange[1]);

      // Create budgetObject based on input conditions
      const ratingObject = {};

      // If only gte value is given
      if (minAmount && !maxAmount) {
        ratingObject.$gte = minAmount;
      }

      // If only lte value is given
      if (!minAmount && maxAmount) {
        ratingObject.$lte = maxAmount;
      }

      // If a range value is given (both gte and lte values are available)
      if (minAmount && maxAmount) {
        ratingObject.$gte = minAmount;
        ratingObject.$lte = maxAmount;
      }

      // Add budgetObject to the query object
      queryObj.averageRating = ratingObject;
    }
    // Handle search filtering
    // if (req.query.search) {
    //   const searchTerm = req.query.search;
    //   const regex = new RegExp(searchTerm, 'i');
    //   queryObj.$or = [
    //     { name: regex }, // Search in the 'name' field
    //     { location: regex }
    //   ];
    // }
    // Handle service events filtering
    if (req.query.services) {
      const services = req.query.services.split(','); // assuming services are comma-separated
      queryObj.services = { $in: services };
    }


    await Entertainer.find(queryObj).then(entertainers => {
      res.render('entertainers', { searchInput: searchInput, entertainerList: entertainers });
    })
  }
  catch (err) {

  }
}


/**
 * GET /entertainers/:id
 * Entertainer
*/
exports.exploreEntertainer = async (req, res) => {
  try {
    let entertainerId = req.params.id;
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    await Entertainer.findById(entertainerId).then(entertainer => {
      const ratings = entertainer.ratings;
      const totalRatings = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const avgRatingUnRounded = Math.round((totalRatings / ratings.length) * 10) / 10;
      const avgRating = avgRatingUnRounded.toFixed(1);
      res.render('entertainer_details', { entertainer: entertainer, avgRating: avgRating, infoErrorsObj, infoSubmitObj });
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


exports.rateEntertainer = async (req, res) => {

  try {
    const entertainerId = req.params.id
    const entertainer = await Entertainer.findById(entertainerId);
    const rating = req.body.rating;
    const ratings = { user_id: "pqr", rate: rating }
    entertainer.ratings.push(ratings)
    entertainer.save();

    const rates = entertainer.ratings;
    const totalRatings = rates.reduce((sum, rating) => sum + rating.rate, 0);
    const avgRatingUnRounded = Math.round((totalRatings / rates.length) * 10) / 10;
    const avgRating = avgRatingUnRounded.toFixed(1);
    console.log(avgRating)

    await Entertainer.findOneAndUpdate({ _id: entertainerId }, {
      $set: {
        averageRating: avgRating
      }
    })

    res.redirect("/entertainers/" + `${entertainerId}`);
  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" })
  }
}


exports.enquireEntertainer = async (req, res) => {const entertainerId = req.params.id;
  try {
    
    const contact = req.body.contact;
    console.log(contact)
    var contact_regex = /^\d{10}$/;
    if (!contact_regex.test(contact)) {
      req.flash('infoErrors',[{ message: 'Invalid contact number' }]);
      return res.redirect("/entertainers/" + `${entertainerId}`)
    }
    req.flash('infoSubmit',[{message : 'Enquiry sent successfully!'}])
    res.redirect("/entertainers/" + `${entertainerId}`);
  }
  catch (error) {
    req.flash('infoErrors', error);
    res.redirect("/entertainers/" + `${entertainerId}`);
  }
}

/**
 * GET /register-entertainer
 * entertainer-registration
*/
exports.registerEntertainer = async (req, res) => {
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  // res.render('venue_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj });


  const userid = req.params.id;
  const user = await Entertainer.findOne({ userid });
  if (user) {
    req.flash('warndata', 'Entertainer already exists with this account , To add new , create new Account !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: null, WarningData: WarningData });
  }

  return res.render('entertainer_details_form', { title: 'Dream Stories - Organisation Registration ', infoErrorsObj, infoSubmitObj , userid: userid });
}

/**
 * POST /register-entertaner
 * register on post
*/

exports.registerEntertainerOnPost = async (req, res) => {
  const userid = req.params.id;
  try {
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
    
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let portfolioPhotos = [];
    let newPortfolioName;
    let uploadPortfolioPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } if (req.files && req.files.image) {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }
    if (req.files && req.files.photos) {
      let uploadedPhotos = req.files.photos;

      if (!Array.isArray(uploadedPhotos)) {
        // If only one file is uploaded, wrap it in an array for consistency
        uploadedPhotos = [uploadedPhotos];
      }

      for (const photo of uploadedPhotos) {
        if (photo && photo.name) {
          newPortfolioName = Date.now() + photo.name;
          uploadPortfolioPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

          photo.mv(uploadPortfolioPath, function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

          portfolioPhotos.push({ url: newPortfolioName });
        }
      }
    } else {
      console.log('No photos were uploaded.');
    }
    // const events = req.body.event;
    // const prices = req.body.price;

    // const ent_prices = [];

    // loop1: for (let elem1 of events) {
    //   for (let elem2 of prices) {
    //     ent_prices.push({ event: elem1, price: elem2 })
    //     continue loop1;
    //   }
    // }

    
    const events = Array.isArray(req.body.event) ? req.body.event : [req.body.event];
    const prices = Array.isArray(req.body.price) ? req.body.price : [req.body.price];

    const ent_prices = [];

    for (let i = 0; i < Math.max(events.length, prices.length); i++) {
      const event = events[i] || ''; // Use empty string if package name doesn't exist
      const eventPrice = prices[i] || 0; // Use 0 if package price doesn't exist
      ent_prices.push({ event: event, price: eventPrice });
    }


    const newEntertainer = new Entertainer({
      userid: userid,
      name: req.body.name,
      address: req.body.address,
      location: req.body.location,
      addressUrl: req.body.addressUrl,
      about: req.body.about,
      contact: req.body.contact,
      email: req.body.email,
      services: req.body.services,
      since: req.body.since,
      entertainer_type: req.body.entertainer_type,
      eventsManaged: req.body.eventsManaged,
      payment_terms: req.body.payment,
      experience: req.body.experience,
      budget: req.body.budget,
      travelCost: req.body.travel,
      instaUrl: req.body.instaUrl,
      fbUrl: req.body.fbUrl,
      profilePhoto: newImageName,
      portfolioPhotos: portfolioPhotos
    });

    newEntertainer.prices = ent_prices;
    await newEntertainer.save();

    req.flash('subdata', 'Organisation has been registered.')
    res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  } catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/register-entertainer/'+ `${userid}`);
  }
}



/**
 * GET / /entertainers/edit/:id
 * entertainer-details-update
*/
exports.entertainersEdit = async (req, res) => {
  const userid = req.params.id;
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');

    

    const entertainer = await Entertainer.findOne({ userid });

    if (!entertainer) {
      req.flash('errordata', 'No such User Exists as Entertainer !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }
    res.render('entertainer_edit', { userid: userid, entertainer, infoErrorsObj, infoSubmitObj })

  }
  catch (error) {
    req.flash('errordata', 'Error Occured!!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }
}

/**
 * POST /entertainers/edit/:id
 * entertainer-updation
*/

exports.entertainersEditPost = async (req, res) => { 
   const userid = req.params.id;
  try {
  

    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let portfolioPhotos = [];
    let newPortfolioName;
    let uploadPortfolioPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
      console.log(req.files)
    } if (req.files && req.files.image) {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;


      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      })

    }
    if (req.files && req.files.photos) {
      let uploadedPhotos = req.files.photos;

      if (!Array.isArray(uploadedPhotos)) {
        // If only one file is uploaded, wrap it in an array for consistency
        uploadedPhotos = [uploadedPhotos];
      }

      for (const photo of uploadedPhotos) {
        if (photo && photo.name) {
          newPortfolioName = Date.now() + photo.name;
          uploadPortfolioPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

          photo.mv(uploadPortfolioPath, function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });

          portfolioPhotos.push({ url: newPortfolioName });
        }
      }
    } else {
      console.log('No photos were uploaded.');
    }

    const events = Array.isArray(req.body.event) ? req.body.event : [req.body.event];
    const eventPrices = Array.isArray(req.body.price) ? req.body.price : [req.body.price];

    const prices = [];

    for (let i = 0; i < Math.max(events.length, eventPrices.length); i++) {
      const event = events[i] || ''; // Use empty string if package name doesn't exist
      const eventPrice = eventPrices[i] || 0; // Use 0 if package price doesn't exist
      prices.push({ event: event, price: eventPrice });
    }


    const entertainer = await Entertainer.findOneAndUpdate({ userid }, {
      $set: {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        addressUrl: req.body.addressUrl,
        about: req.body.about,
        contact: req.body.contact,
        email: req.body.email,
        services: req.body.services,
        since: req.body.since,
        entertainer_type: req.body.entertainer_type,
        eventsManaged: req.body.eventsManaged,
        payment_terms: req.body.payment,
        experience: req.body.experience,
        budget: req.body.budget,
        travelCost: req.body.travel,
        prices: prices,
        instaUrl: req.body.instaUrl,
        fbUrl: req.body.fbUrl,
        profilePhoto: newImageName,
        portfolioPhotos: portfolioPhotos
      }
    },
      { upsert: true, new: true }
    )

    req.flash('infoSubmit', 'Entertainer details Updated!')
    res.redirect('/entertainers/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/entertainers/edit/'+ `${userid}`);
  }
}


/**
 * GET /entertainers/add-price/:id
 * entertainer-add-prices
*/
exports.addEntertainerPrice = async (req, res) => {
  const userid = req.params.id;
  try{
  const entertainer = await Entertainer.findOne({userid})
  res.render('addEntertainerPrice', { entertainer })}
  catch(error){
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/entertainers/edit/'+ `${userid}`);
  }
}

/**
 * POST /entertainers/add-price/:id
 * entertainer-add-prices
*/
exports.addEntertainerPriceOnPost = async (req, res) => { 
  const userid = req.params.id;
  try {
   
    const { event, price } = req.body;

    const pricesToAdd = [];

    if (!Array.isArray(event)) {
      // If package_name is not an array, convert it into an array
      pricesToAdd.push({ event, price: price || 0 });
    } else {
      // If package_name is an array, iterate through each element
      for (let i = 0; i < event.length; i++) {
        const eventName = event[i];
        const eventPrice = price[i] || 0;
        pricesToAdd.push({ event: eventName, price: eventPrice });
      }
    }

    await Entertainer.findOneAndUpdate(
      { userid },
      {
        $push: {
          prices: {
            $each: pricesToAdd
          }
        }
      }
    );

    req.flash('infoSubmit', 'Price Registered!')
    res.redirect('/entertainers/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/entertainers/edit/'+ `${userid}`);
  }
}

/**
 * POST /entertainers/del-price/:id/:pid
 * enteratiner-prices-delete
*/
exports.delEntertainerPrice = async (req, res) => {  
  const userid = req.params.id;
  try {
  
    const priceId = req.params.pid;
    const entertainer = await Entertainer.findOne({userid});

    entertainer.prices.pull(priceId)

    await entertainer.save();

    req.flash('infoSubmit', 'Price details deleted successfully.')
    res.redirect('/entertainers/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/entertainers/edit/'+ `${userid}`);
  }
}


exports.addEntertainersServices = async (req, res) => {
  const userid = req.params.id;
  try {
    
    const entertainer = await Entertainer.findOne({userid});
    res.render('addEntertainerService', { entertainer })
  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/entertainers/edit/'+ `${userid}`);
  }
}


exports.delEntertainersService = async (req, res) => {
  const userid = req.params.id;
  try {
    
    const service = req.params.service;
    const entertainer = await Entertainer.findOne({userid});

    entertainer.services.pull(service)

    await entertainer.save();

    req.flash('infoSubmit', 'Service Deleted!')
    res.redirect('/entertainers/edit/' + `${userid}`);

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/entertainers/edit/'+ `${userid}`);
  }
}


exports.addEntertainersServicesOnPost = async (req, res) => {
  const userid = req.params.id;
  try {
    await Entertainer.findOneAndUpdate(
      { userid },
      {
        $push: {
          services: {
            $each: req.body.services
          }
        }
      }
    );

    req.flash('infoSubmit', 'Service/s Added!')
    res.redirect('/entertainers/edit/' + `${userid}`)

  }
  catch (error) {
    req.flash('infoErrors',[{ message: `${error}`}]);
    res.redirect('/entertainers/edit/'+ `${userid}`);
  }
}


/**
 * POST /delete-entertainer/:id
 * entertainer-delete
*/
exports.deleteEntertainer = async (req, res) => {
    const userid = req.params.id;
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
  
    try {
      const result = await Entertainer.findOne({ userid });
  
      if (!result) {
        req.flash('errordata', 'No User Found as Entertainer !!');
        return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
      }
  
      await Entertainer.deleteOne({ userid });
      req.flash('subdata', 'Entertainer Deleted Successfully !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  
    } catch (error) {
      console.log(error);
      req.flash('errordata', 'Error Occurred While Deleting Entertainer!!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }
}


exports.back = async (req,res)=>{
  const userid = req.params.id; 
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');
  try{
   
    res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: null, WarningData: null })
  }
  catch(error){
    req.flash('errordata', 'Error Occured!!');
    res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null })
  }
}








/**---------------------------- Decorators ----------------------------------------------------------- */
/*
GET Decorators
*/

exports.exploreDecorators = async (req, res) => {
  Decorator.find({}).then(decorators => {
    res.render('decorators', {
      decoratorList: decorators
    })
  }
  )
}

/**
 * GET /decorators/:id
 * Decorator
*/
exports.exploreDecorator = async (req, res) => {
  try {
    let decoratorId = req.params.id;
    const decorator = await Decorator.findById(decoratorId);
    const decorid = decorator._id;
    res.render('decorator_details', { decorator, decorid });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/*
Update the ratings of Decorators
*/

exports.decorupdateRating = async (req, res) => {
  const decorId = req.params.id;
  const clientRating = parseFloat(req.body.clientRating);

  const decorator = await Decorator.findById(decorId);

  if (!decorator) {
    return res.status(404).json({ error: 'Decorator not found' });
  }

  let updatedRating;
  if (decorator.dratingscount === 0) {
    updatedRating = clientRating;
  } else {
    updatedRating = (decorator.dratings * decorator.dratingscount + clientRating) / (decorator.dratingscount + 1);
  }
  decorator.dratingscount = decorator.dratingscount + 1;

  updatedRating = updatedRating.toFixed(1);

  await Decorator.findByIdAndUpdate(decorId, { dratings: updatedRating, dratingscount: decorator.dratingscount });

  res.json({ updatedRating });
}


/*
Search Decorators
*/

exports.searchDecor = async (req, res) => {
  try {
    const searchtext = req.query.searchtext;
    const decorators = await Decorator.find({
      "$or": [
        { "dname": { "$regex": searchtext, $options: 'i' } },
        { "dlocation": { "$regex": searchtext, $options: 'i' } },
        { "dservicetype": { "$regex": searchtext, $options: 'i' } },
      ]
    }).then(decorators => {
      res.render('decorators', {
        decoratorList: decorators
      })
    })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/*
 Filter the Decorators
 */
exports.filterDecor = async (req, res) => {
  const budgetRange = req.query.budget;
  const ratingRange = req.query.rating;

  try {

    let filterConditions = [];

    if (budgetRange) {
      const [minBudget, maxBudget] = budgetRange.split('-');
      filterConditions.push({
        "dstartprice": { $gte: minBudget, $lte: maxBudget }
      });
    }

    if (ratingRange) {
      const [minRating, maxRating] = ratingRange.split('-');
      filterConditions.push({
        "dratings": { $gte: minRating, $lte: maxRating }
      });
    }

    const query = filterConditions.length === 0 ? {} : { $and: filterConditions };

    const decorators = await Decorator.find(query).then(decorators => {
      console.log(decorators);
      res.render('decorators', {
        decoratorList: decorators
      })
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* Open Add Form For Decorator*/
exports.openDecorform = async (req, res) => {
  const infoErrorsObjdecor = req.flash('infoErrorsdecor');
  const infoSubmitObjdecor = req.flash('infoSubmitdecor');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  const userid = req.params.id;
  const user = await Decorator.findOne({ userid });
  if (user) {
    req.flash('warndata', 'Decorator already exists with this account , To add new , create new Account !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: null, WarningData: WarningData });
  }

  return res.render('addDecorForm', { infoErrorsObjdecor: infoErrorsObjdecor, infoSubmitObjdecor: infoSubmitObjdecor, userid: userid });
}

/**Open Update Form For Decorator */
exports.openDecorupdform = async (req, res) => {
  const infoErrorsObjdecorupd = req.flash('infoErrorsdecorupd');
  const infoSubmitObjdecorupd = req.flash('infoSubmitdecorupd');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  const userid = req.params.id;

  const user = await Decorator.findOne({ userid });

  if (!user) {
    req.flash('errordata', 'No such User Exists as Decorator !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }

  const name = user.dname;
  const loc = user.dlocation;
  const start = user.dstartprice;
  const desc = user.dabout;
  const yearop = user.dyearop;
  const service = user.dservicetype;
  const indoor = user.dindoor;
  const outdoor = user.doutdoor;
  const since = user.dsince;
  const insta = user.dinstaurl;
  const fb = user.dfburl;
  const contact = user.dcontact;

  return res.render('editDecorForm', {
    infoErrorsObjdecorupd: infoErrorsObjdecorupd, infoSubmitObjdecorupd: infoSubmitObjdecorupd, userid: userid,
    name: name,
    loc: loc,
    start: start,
    desc: desc,
    yearop: yearop,
    service: service,
    indoor: indoor,
    outdoor: outdoor,
    since: since,
    insta: insta,
    fb: fb,
    contact: contact
  });
}

/**Add Decorator */
exports.addDecor = async (req, res) => {
  try {
    const userid = req.params.id;
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');



    if (isNaN(req.body.dstartprice)) {
      req.flash('infoErrorsdecor', 'Starting Price must contain only numeric value !!');
      return res.redirect('/adddecorform');
    }
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
    }
    else {
      imageUploadFile = req.files.dprofilepic;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      })
    }

    const pimages = req.files.dportfolio;
    const portfolio = [];

    if (pimages && pimages.length > 0) {
      pimages.forEach((image) => {
        let newPortfolioName = Date.now() + image.name;
        const puploadPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

        image.mv(puploadPath, function (err) {
          if (err) return res.status(500).send(err);
        })
        portfolio.push({ url: newPortfolioName });
      });
    }

    const newDecor = new Decorator({
      dname: req.body.dname,
      dlocation: req.body.dlocation,
      dstartprice: req.body.dstartprice,
      dindoor: req.body.dindoor,
      doutdoor: req.body.doutdoor,
      dabout: req.body.dabout,
      dsince: req.body.dsince,
      dyearop: req.body.dyearop,
      dservicetype: req.body.dservicetype,
      dinstaurl: req.body.dinstaurl,
      dfburl: req.body.dfburl,
      dcontact: req.body.dcontact,
      userid: req.params.id,
      dprofilepic: newImageName,
      dportfolio: portfolio
    });

    await newDecor.save();
    req.flash('subdata', 'Decorator Added successfully !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  }
  catch (error) {
    console.log(error);
    req.flash('infoErrorsdecor', 'Error Occurred !!');
    return res.redirect('/adddecorform');
  }
};

/**Update Decorator */
exports.updDecor = async (req, res) => {
  const userid = req.params.id;
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');

  try {

    const updateFields = {};

    // Find the user's record by their user ID
    const user = await Decorator.findOne({ userid });

    if (!user) {
      req.flash('errordata', 'No such User Exists as Decorator !');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }

    if (req.body.dlocation) {
      updateFields.dlocation = req.body.dlocation;
    }
    if (req.body.dabout) {
      updateFields.dlocation = req.body.dabout;
    }
    if (req.body.dservicetype) {
      updateFields.dservicetype = req.body.dservicetype;
    }
    if (req.body.dindoor) {
      updateFields.dindoor = req.body.dindoor;
    }
    if (req.body.doutdoor) {
      updateFields.doutdoor = req.body.doutdoor;
    }
    if (req.body.dinstaurl) {
      updateFields.dinstaurl = req.body.dinstaurl;
    }
    if (req.body.dfburl) {
      updateFields.dfburl = req.body.dfburl;
    }
    if (req.body.dcontact) {
      updateFields.dcontact = req.body.dcontact;
    }

    if (isNaN(req.body.dstartprice)) {
      req.flash('infoErrorsdecorupd', 'Starting Price must contain only a numeric value !!');
      return res.redirect('/upddecorform/' + userid); // Redirect to the edit form
    }



    // Handle profile picture update
    let newImageName = null;
    if (req.files && req.files.dprofilepic) {
      const imageUploadFile = req.files.dprofilepic;
      newImageName = Date.now() + imageUploadFile.name;
      const uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    // Handle portfolio image update
    const existingPortfolio = user.dportfolio || [];
    let pimages = req.files?.dportfolio || [];
    const portfolio = existingPortfolio.slice();

    if (pimages.length > 0) {
      pimages.forEach((image) => {
        const newPortfolioName = Date.now() + image.name;
        const puploadPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

        image.mv(puploadPath, function (err) {
          if (err) return res.status(500).send(err);
        });
        portfolio.push({ url: newPortfolioName });
      });
    }

    if (newImageName) {
      updateFields.dprofilepic = newImageName;
    }

    if (portfolio.length > 0) {
      updateFields.dportfolio = portfolio;
    }


    const updatedDocument = await Decorator.updateOne({ userid }, { $set: updateFields });

    if (updatedDocument) {
      req.flash('subdata', 'Decorator updated successfully !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null }); // Redirect to a success page or home page
    }
    else {
      req.flash('infoErrorsdecorupd', 'An error occurred while updating your information!!');
      return res.redirect('/upddecorform/' + userid);
    }
  } catch (error) {
    console.log(error);
    req.flash('infoErrorsdecorupd', 'Error Occurred !!');
    return res.redirect('/upddecorform/' + userid); // Redirect to the edit form
  }
};

/**Delete Decorator */
exports.delDecor = async (req, res) => {
  const userid = req.params.id;
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  try {
    const result = await Decorator.findOne({ userid });

    if (!result) {
      req.flash('errordata', 'No User Found as Decorator !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }

    await Decorator.deleteOne({ userid });
    req.flash('subdata', 'Decorator Deleted Successfully !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });

  } catch (error) {
    console.log(error);
    req.flash('errordata', 'Error Occurred While Deleting Decorator!!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }
};



/**---------------------------- Caterers ----------------------------------------------------------- */

/*
GET Caterers
*/

exports.exploreCaterers = async (req, res) => {
  Caterer.find({}).then(caterers => {
    res.render('caterers', {
      catererList: caterers
    })
  }
  )
}

/**
 * GET /caterers/:id
 * Caterer
*/
exports.exploreCaterer = async (req, res) => {
  try {
    let catererId = req.params.id;
    const caterer = await Caterer.findById(catererId);
    const catid = caterer._id;
    res.render('caterer_details', { caterer, catid });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/*
Update the ratings of Caterers
*/

exports.catererupdateRating = async (req, res) => {
  const catererId = req.params.id;
  const clientRating = parseFloat(req.body.clientRating);

  const caterer = await Caterer.findById(catererId);

  if (!caterer) {
    return res.status(404).json({ error: 'Caterer not found' });
  }

  let updatedRating;
  if (caterer.cratingscount === 0) {
    updatedRating = clientRating;
  } else {
    updatedRating = (caterer.cratings * caterer.cratingscount + clientRating) / (caterer.cratingscount + 1);
  }
  caterer.cratingscount = caterer.cratingscount + 1;

  updatedRating = updatedRating.toFixed(1);

  await Caterer.findByIdAndUpdate(catererId, { cratings: updatedRating, cratingscount: caterer.cratingscount });

  res.json({ updatedRating });
}

/*
Search Caterers
*/

exports.searchCaterer = async (req, res) => {
  try {
    const searchtext = req.query.searchtext;
    const caterers = await Caterer.find({
      "$or": [
        { "cname": { "$regex": searchtext, $options: 'i' } },
        { "clocation": { "$regex": searchtext, $options: 'i' } },
        { "cuisines": { "$regex": searchtext, $options: 'i' } },
        { "ccaterertype": { "$regex": searchtext, $options: 'i' } },
        { "cvegonly": { "$regex": searchtext, $options: 'i' } },
        { "cmincapacity": { "$regex": searchtext, $options: 'i' } },
        { "cmaxcapacity": { "$regex": searchtext, $options: 'i' } },
      ]
    }).then(caterers => {
      res.render('caterers', {
        catererList: caterers
      })
    })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}



/*
 Filter the Caterers
 */

exports.filterCaterer = async (req, res) => {
  const budgetRange = req.query.budget;
  const ratingRange = req.query.rating;

  try {

    let filterConditions = [];

    if (budgetRange) {
      const [minBudget, maxBudget] = budgetRange.split('-');
      filterConditions.push({
        "cvegprice": { $gte: minBudget, $lte: maxBudget }
      });
    }

    if (ratingRange) {
      const [minRating, maxRating] = ratingRange.split('-');
      filterConditions.push({
        "cratings": { $gte: minRating, $lte: maxRating }
      });
    }

    const query = filterConditions.length === 0 ? {} : { $and: filterConditions };

    const caterers = await Caterer.find(query).then(caterers => {
      console.log(caterers);
      res.render('caterers', {
        catererList: caterers
      })
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* Open Add Form For Caterer*/
exports.openCatererform = async (req, res) => {
  const infoErrorsObjcaterer = req.flash('infoErrorscaterer');
  const infoSubmitObjcaterer = req.flash('infoSubmitcaterer');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  const userid = req.params.id;
  const user = await Caterer.findOne({ userid });
  if (user) {
    req.flash('warndata', 'Caterer already exists with this account , To add new , create new Account !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: null, WarningData: WarningData });
  }

  return res.render('addCatererForm', { infoErrorsObjcaterer: infoErrorsObjcaterer, infoSubmitObjcaterer: infoSubmitObjcaterer, userid: userid });
}

/**Open Update Form For Caterer */
exports.openCatererupdform = async (req, res) => {
  const infoErrorsObjcatererupd = req.flash('infoErrorscatererupd');
  const infoSubmitObjcatererupd = req.flash('infoSubmitcatererupd');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  const userid = req.params.id;

  const user = await Caterer.findOne({ userid });

  if (!user) {
    req.flash('errordata', 'No such User Exists as Caterer !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }

  const name = user.cname;
  const loc = user.clocation;
  const vegonly = user.cvegonly;
  const start = user.cvegprice;
  const nonveg = user.cnonvegprice;
  const desc = user.cabout;
  const yearop = user.cyearop;
  const service = user.ccaterertype;
  const cuisines = user.cuisines;
  const min = user.cmincapacity;
  const max = user.cmaxcapacity;
  const pack = user.cpack;
  const since = user.csince;
  const insta = user.cinstaurl;
  const fb = user.cfburl;
  const contact = user.ccontact;

  return res.render('editCatererForm', {
    infoErrorsObjcatererupd: infoErrorsObjcatererupd, infoSubmitObjcatererupd: infoSubmitObjcatererupd, userid: userid,
    name: name,
    loc: loc,
    start: start,
    desc: desc,
    yearop: yearop,
    service: service,
    vegonly: vegonly,
    nonveg: nonveg,
    cuisines: cuisines,
    min: min,
    max: max,
    pack: pack,
    since: since,
    insta: insta,
    fb: fb,
    contact: contact
  });
}

/**Add Caterer */
exports.addCaterer = async (req, res) => {
  try {
    const userid = req.params.id;
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');
  
    if(isNaN(req.body.cvegprice))
    {
      req.flash('infoErrorscaterer' , 'Starting Price must contain only numeric value !!');
      return res.redirect('/addcatererform/'+userid) ;

    }
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
    }
    else {
      imageUploadFile = req.files.cprofilepic;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      })
    }

    const pimages = req.files.cportfolio;
    const portfolio = [];

    if (pimages && pimages.length > 0) {
      pimages.forEach((image) => {
        let newPortfolioName = Date.now() + image.name;
        const puploadPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

        image.mv(puploadPath, function (err) {
          if (err) return res.status(500).send(err);
        })
        portfolio.push({ url: newPortfolioName });
      });
    }

    const newCaterer = new Caterer({
      cname: req.body.cname,
      clocation: req.body.clocation,
      cvegonly: req.body.cvegonly,
      cvegprice: req.body.cvegprice,
      cnonvegprice: req.body.cnonvegprice,
      cuisines: req.body.cuisines,
      cmincapacity: req.body.cmincapacity,
      cmaxcapacity: req.body.cmaxcapacity,
      cpack: req.body.cpack,
      cabout: req.body.cabout,
      csince: req.body.csince,
      cyearop: req.body.cyearop,
      ccaterertype: req.body.ccaterertype,
      cinstaurl: req.body.cinstaurl,
      cfburl: req.body.cfburl,
      ccontact: req.body.ccontact,
      userid: req.params.id,
      cprofilepic: newImageName,
      cportfolio: portfolio
    });

    await newCaterer.save();
    req.flash('subdata', 'Caterer Added successfully !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  }
  catch (error) {
    console.log(error);
    req.flash('infoErrorscaterer', 'Error Occurred !!');
    return res.redirect('/addcatererform');
  }
};

/**Update Caterer */
exports.updCaterer = async (req, res) => {
  const userid = req.params.id;
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');

  try {

    const updateFields = {};

    // Find the user's record by their user ID
    const user = await Caterer.findOne({ userid });

    if (!user) {
      req.flash('errordata', 'No such User Exists as Decorator !');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }

    if (req.body.clocation) {
      updateFields.clocation = req.body.clocation;
    }
    if (req.body.cabout) {
      updateFields.clocation = req.body.cabout;
    }
    if (req.body.ccaterertype) {
      updateFields.ccaterertype = req.body.ccaterertype;
    }
    if (req.body.cvegonly) {
      updateFields.cvegonly = req.body.cvegonly;
    }
    if (req.body.cnonvegprice) {
      updateFields.cnonvegprice = req.body.cnonvegprice;
    }
    if (req.body.cuisines) {
      updateFields.cuisines = req.body.cuisines;
    }
    if (req.body.cmincapacity) {
      updateFields.cmincapacity = req.body.cmincapacity;
    }
    if (req.body.cmaxcapacity) {
      updateFields.cmaxcapacity = req.body.cmaxcapacity;
    }
    if (req.body.cpack) {
      // Ensure updateFields.cpack is an array
      updateFields.cpack = updateFields.cpack || [];

      if (Array.isArray(req.body.cpack)) {
        // If it's an array, append each package
        updateFields.cpack = updateFields.cpack.concat(req.body.cpack);
      } else {
        // If it's a single value, convert it to an array and append
        updateFields.cpack.push(req.body.cpack);
      }
    }


    if (req.body.cinstaurl) {
      updateFields.cinstaurl = req.body.cinstaurl;
    }
    if (req.body.dfburl) {
      updateFields.cfburl = req.body.cfburl;
    }
    if (req.body.dcontact) {
      updateFields.ccontact = req.body.ccontact;
    }

    if (isNaN(req.body.cvegprice)) {
      req.flash('infoErrorscatererupd', 'Starting Price must contain only a numeric value !!');
      return res.redirect('/updcatererform/' + userid); // Redirect to the edit form
    }



    // Handle profile picture update
    let newImageName = null;
    if (req.files && req.files.cprofilepic) {
      const imageUploadFile = req.files.dprofilepic;
      newImageName = Date.now() + imageUploadFile.name;
      const uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    // Handle portfolio image update
    const existingPortfolio = user.cportfolio || [];
    let pimages = req.files?.cportfolio || [];
    const portfolio = existingPortfolio.slice();

    if (pimages.length > 0) {
      pimages.forEach((image) => {
        const newPortfolioName = Date.now() + image.name;
        const puploadPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

        image.mv(puploadPath, function (err) {
          if (err) return res.status(500).send(err);
        });
        portfolio.push({ url: newPortfolioName });
      });
    }

    if (newImageName) {
      updateFields.cprofilepic = newImageName;
    }

    if (portfolio.length > 0) {
      updateFields.cportfolio = portfolio;
    }


    const updatedDocument = await Caterer.updateOne({ userid }, { $set: updateFields });

    if (updatedDocument) {
      req.flash('subdata', 'Caterer updated successfully !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null }); // Redirect to a success page or home page
    }
    else {
      req.flash('infoErrorscatererupd', 'An error occurred while updating your information!!');
      return res.redirect('/updcatererform/' + userid);
    }
  } catch (error) {
    console.log(error);
    req.flash('infoErrorscatererupd', 'Error Occurred !!');
    return res.redirect('/updcatererform/' + userid); // Redirect to the edit form
  }
};

/**Delete Caterer */
exports.delCaterer = async (req, res) => {
  const userid = req.params.id;
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');

  try {
    const result = await Caterer.findOne({ userid });

    if (!result) {
      req.flash('errordata', 'No User Found as Caterer !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }

    await Caterer.deleteOne({ userid });
    req.flash('subdata', 'Caterer Deleted Successfully !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });

  } catch (error) {
    console.log(error);
    req.flash('errordata', 'Error Occurred While Deleting Caterer!!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }
};

/**---------------------------- Invitation Card Providers ----------------------------------------------------------- */
/*
GET Invitations 
*/

exports.exploreInvites = async (req, res) => {
  Invitation.find({}).then(invitations => {
    res.render('invitations', {
      inviteList: invitations
    })
  }
  )
}

/**
 * GET /invitations/:id
 * Invitation
*/
exports.exploreInvite = async (req, res) => {
  try {
    let inviteId = req.params.id;
    const invite = await Invitation.findById(inviteId);
    const inviteid = invite._id;
    res.render('invitation_details', { invite, inviteid });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/*
Update the ratings of Invitaion Card Providers
*/

exports.updateRating = async (req, res) => {
  const inviteId = req.params.id;
  const clientRating = parseFloat(req.body.clientRating);

  const invite = await Invitation.findById(inviteId);

  if (!invite) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  let updatedRating;
  if (invite.iratingscount === 0) {
    updatedRating = clientRating;
  } else {
    updatedRating = (invite.iratings * invite.iratingscount + clientRating) / (invite.iratingscount + 1);
  }
  invite.iratingscount = invite.iratingscount + 1;

  updatedRating = updatedRating.toFixed(1);

  await Invitation.findByIdAndUpdate(inviteId, { iratings: updatedRating, iratingscount: invite.iratingscount });

  res.json({ updatedRating });
}


/*
Search Invitation Providers
*/

exports.searchInvite = async (req, res) => {
  try {
    const searchtext = req.query.searchtext;
    const invitations = await Invitation.find({
      "$or": [
        { "iname": { "$regex": searchtext, $options: 'i' } },
        { "ilocation": { "$regex": searchtext, $options: 'i' } },
        { "iservicetype": { "$regex": searchtext, $options: 'i' } },
        { "ispeciality": { "$regex": searchtext, $options: 'i' } },
        { "ishipping": { "$regex": searchtext, $options: 'i' } },
        { "iminorder": { "$regex": searchtext, $options: 'i' } },
      ]
    }).then(invitations => {
      res.render('invitations', {
        inviteList: invitations
      })
    })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

/*
Filter the Invitation-Card Providers
*/

exports.filterInvite = async (req, res) => {
  const budgetRange = req.query.budget;
  const ratingRange = req.query.rating;

  try {

    let filterConditions = [];

    if (budgetRange) {
      const [minBudget, maxBudget] = budgetRange.split('-');
      filterConditions.push({
        "istart": { $gte: minBudget, $lte: maxBudget }
      });
    }

    if (ratingRange) {
      const [minRating, maxRating] = ratingRange.split('-');
      filterConditions.push({
        "iratings": { $gte: minRating, $lte: maxRating }
      });
    }

    const query = filterConditions.length === 0 ? {} : { $and: filterConditions };

    const invitations = await Invitation.find(query).then(invitations => {
      console.log(invitations);
      res.render('invitations', {
        inviteList: invitations
      })
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/* Open Add Form For Invitation */
exports.openform = async (req, res) => {
  const infoErrorsObjinv = req.flash('infoErrorsinv');
  const infoSubmitObjinv = req.flash('infoSubmitinv');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  const userid = req.params.id;
  const user = await Invitation.findOne({ userid });
  if (user) {
    req.flash('warndata', 'Invitation Card Provider already exists with this account , To add new , create new Account !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: SubmitData, WarningData: WarningData });
  }

  return res.render('addInviteForm', { infoErrorsObjinv: infoErrorsObjinv, infoSubmitObjinv: infoSubmitObjinv, userid: userid });
}

/**Open Update Form For Invitation */
exports.openupdform = async (req, res) => {
  const infoErrorsObjinvupd = req.flash('infoErrorsinvupd');
  const infoSubmitObjinvupd = req.flash('infoSubmitinvupd');
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  const userid = req.params.id;

  const user = await Invitation.findOne({ userid });

  if (!user) {
    req.flash('errordata', 'No such User Exists as Invitation Card Provider !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }

  const name = user.iname;
  const loc = user.ilocation;
  const start = user.istart;
  const desc = user.iabout;
  const yearop = user.iyearop;
  const service = user.iservicetype;
  const range = user.irange;
  const special = user.ispeciality;
  const shipp = user.ishipping;
  const min = user.iminorder;
  const since = user.isince;
  const insta = user.iinstaurl;
  const fb = user.ifburl;
  const contact = user.icontact;

  return res.render('editInvitationForm', {
    infoErrorsObjinvupd: infoErrorsObjinvupd, infoSubmitObjinvupd: infoSubmitObjinvupd, userid: userid,
    name: name,
    loc: loc,
    start: start,
    desc: desc,
    yearop: yearop,
    service: service,
    range: range,
    special: special,
    shipp: shipp,
    min: min,
    since: since,
    insta: insta,
    fb: fb,
    contact: contact
  });
}

/**Add Invitation */
exports.addInvite = async (req, res) => {
  try {
    const userid = req.params.id;
    const ErrorData = req.flash('errordata');
    const SubmitData = req.flash('subdata');
    const WarningData = req.flash('warndata');



    if (isNaN(req.body.istart)) {
      req.flash('infoErrorsinv', 'Starting Price must contain only numeric value !!');
      return res.redirect('/addinviteform');
    }
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
    }
    else {
      imageUploadFile = req.files.iprofilepic;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      })
    }

    const pimages = req.files.iportfolio;
    const portfolio = [];

    if (pimages && pimages.length > 0) {
      pimages.forEach((image) => {
        let newPortfolioName = Date.now() + image.name;
        const puploadPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

        image.mv(puploadPath, function (err) {
          if (err) return res.status(500).send(err);
        })
        portfolio.push({ url: newPortfolioName });
      });
    }

    const newInvitation = new Invitation({
      iname: req.body.iname,
      ilocation: req.body.ilocation,
      istart: req.body.istart,
      irange: req.body.irange,
      iabout: req.body.iabout,
      isince: req.body.isince,
      iyearop: req.body.iyearop,
      iservicetype: req.body.iservicetype,
      ishipping: req.body.ishipping,
      ispeciality: req.body.ispeciality,
      iminorder: req.body.iminorder,
      iinstaurl: req.body.iinstaurl,
      ifburl: req.body.ifburl,
      icontact: req.body.icontact,
      userid: req.params.id,
      iprofilepic: newImageName,
      iportfolio: portfolio
    });

    await newInvitation.save();
    req.flash('subdata', 'Invitation Card Provider Added successfully !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });
  }
  catch (error) {
    console.log(error);
    req.flash('infoErrorsinv', 'Error Occurred !!');
    return res.redirect('/addinviteform');
  }
};

/**Update Invitation */
exports.updInvite = async (req, res) => {
  const userid = req.params.id;
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');

  try {

    const updateFields = {};

    // Find the user's record by their user ID
    const user = await Invitation.findOne({ userid });

    if (!user) {
      req.flash('errordata', 'No such User Exists as Invitation Card Provider !');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }

    if (req.body.ilocation) {
      updateFields.ilocation = req.body.ilocation;
    }
    if (req.body.iabout) {
      updateFields.ilocation = req.body.iabout;
    }
    if (req.body.iservicetype) {
      updateFields.iservicetype = req.body.iservicetype;
    }
    if (req.body.ishipping) {
      updateFields.ishipping = req.body.ishipping;
    }
    if (req.body.irange) {
      updateFields.irange = req.body.irange;
    }
    if (req.body.ispeciality) {
      updateFields.ispeciality = req.body.ispeciality;
    }
    if (req.body.iminorder) {
      updateFields.iminorder = req.body.iminorder;
    }
    if (req.body.iinstaurl) {
      updateFields.iinstaurl = req.body.iinstaurl;
    }
    if (req.body.ifburl) {
      updateFields.ifburl = req.body.ifburl;
    }
    if (req.body.icontact) {
      updateFields.icontact = req.body.icontact;
    }

    if (isNaN(req.body.istart)) {
      req.flash('infoErrorsinvupd', 'Starting Price must contain only a numeric value !!');
      return res.redirect('/updinviteform/' + userid); // Redirect to the edit form
    }



    // Handle profile picture update
    let newImageName = null;
    if (req.files && req.files.iprofilepic) {
      const imageUploadFile = req.files.iprofilepic;
      newImageName = Date.now() + imageUploadFile.name;
      const uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    // Handle portfolio image update
    const existingPortfolio = user.iportfolio || [];
    let pimages = req.files?.iportfolio || [];
    const portfolio = existingPortfolio.slice();

    if (pimages.length > 0) {
      pimages.forEach((image) => {
        const newPortfolioName = Date.now() + image.name;
        const puploadPath = require('path').resolve('./') + '/public/uploads/' + newPortfolioName;

        image.mv(puploadPath, function (err) {
          if (err) return res.status(500).send(err);
        });
        portfolio.push({ url: newPortfolioName });
      });
    }

    if (newImageName) {
      updateFields.iprofilepic = newImageName;
    }

    if (portfolio.length > 0) {
      updateFields.iportfolio = portfolio;
    }


    const updatedDocument = await Invitation.updateOne({ userid }, { $set: updateFields });

    if (updatedDocument) {
      req.flash('subdata', 'Invitation Card Provider updated successfully !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null }); // Redirect to a success page or home page
    }
    else {
      req.flash('infoErrorsinvupd', 'An error occurred while updating your information!!');
      return res.redirect('/updinviteform/' + userid);
    }
  } catch (error) {
    console.log(error);
    req.flash('infoErrorsinvupd', 'Error Occurred !!');
    return res.redirect('/updinviteform/' + userid); // Redirect to the edit form
  }
};

/**Delete Invitation */
exports.delInvite = async (req, res) => {
  const userid = req.params.id;
  const ErrorData = req.flash('errordata');
  const SubmitData = req.flash('subdata');
  const WarningData = req.flash('warndata');


  try {
    const result = await Invitation.findOne({ userid });

    if (!result) {
      req.flash('errordata', 'No User Found as Invitation Card Provider !!');
      return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
    }

    await Invitation.deleteOne({ userid });
    req.flash('subdata', 'Invitation Card Provider Deleted Successfully !!');
    return res.render('addeditvendor', { userid: userid, ErrorData: null, SubmitData: SubmitData, WarningData: null });

  } catch (error) {
    console.log(error);
    req.flash('errordata', 'Error Occurred While Deleting Invitation Card Provider!!');
    return res.render('addeditvendor', { userid: userid, ErrorData: ErrorData, SubmitData: null, WarningData: null });
  }
};



//Reviews

exports.exploreReviews = async (req, res) => {
  try {
    const limitReview = 25;
    const reviews = await Review.find({}).limit(limitReview);
    res.render('reviews', { reviews });

  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}
exports.exploreReviewsById = async (req, res) => {
  try {
    let reviewId = req.params.id;
    const limitNumber = 20;
    const reviewById = await Review.find({ 'review': reviewId }).limit(limitNumber);
    res.render('reviews', { reviewById });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


exports.submitReviews = async (req, res) => {
  try {
    let date = new Date();
    let dt = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    
    {
    const newReview = new Review({
      username:req.body.usernameR,
      userRating: req.body.rating,
      userRatingDes: req.body.describe,
      reviewDate: dt,
      
    });
    await newReview.save();
    req.flash('infoSubmit', 'Review has been added');
    res.redirect('/');}
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured " });
  }
}

// data=[{
//     name:"The Wedding Scenerio",
//     address: "Alkapuri, Vadodara",
//     about: "The Wedding Scenario are the professional wedding photographers based in Vadoara.With an industry experience of 8 years, they have attained proficiency in capturing the perfect moments. They believe that bonds are beautiful and it is more beautiful to capture them in real- life settings.Bonds are more celebrated at weddings.To capture this celebration in the autocracy of beauty is the aim of The Wedding Scenario. Well - equipped with tools of photography, they provide services in an excellent manner.They are a good option to hire for wedding photography at reasonable prices",
//     email: "xyz@ad.com",
//     contact: "378472847",
//     services: "videos,photos",
//     since: "2 years",
//     paymentTerms: "50% advance",
//     travelCost: "Outstation travel charges borne on client",
//     mostBooked: "10000",
//     deliveryTime: "2 weeks",
//     photo: "35000",
//     photoVideo: "40000",
//     candid: "10000",
//     cinematography: "20000",
//     studio: "10000",
//     preWedding: "30000",
//     albums: "26000",
//     videography: "20000",
//     smallFunction: "10000",
//     profilePhoto: "fern-venue.webp",
//     rating: "5.0"
// },
// {
//     name:"The Photoholics",
//     address: "Alkapuri, Vadodara",
//     about: "The Photoholics are the professional wedding photographers based in Vadoara.With an industry experience of 8 years, they have attained proficiency in capturing the perfect moments. They believe that bonds are beautiful and it is more beautiful to capture them in real- life settings.Bonds are more celebrated at weddings.To capture this celebration in the autocracy of beauty is the aim of The Wedding Scenario. Well - equipped with tools of photography, they provide services in an excellent manner.They are a good option to hire for wedding photography at reasonable prices",
//     email: "xyz@ad.com",
//     contact: "378472847",
//     services: "videos,photos",
//     since: "2 years",
//     paymentTerms: "50% advance",
//     travelCost: "Outstation travel charges borne on client",
//     mostBooked: "10000",
//     deliveryTime: "2 weeks",
//     photo: "35000",
//     photoVideo: "40000",
//     candid: "10000",
//     cinematography: "20000",
//     studio: "10000",
//     preWedding: "30000",
//     albums: "26000",
//     videography: "20000",
//     smallFunction: "10000",
//     profilePhoto: "kabir-farm-venue.jpg",
//     rating: "4.9"
// }
// ]

// Photographer.insertMany(data);

// async function addDummydata(){
//   try{
//     await Decorator.insertMany([

//     ]);
//   }catch(error)
//   {
//     console.log(error);
//   }
// }



// invitedata=[
//   {
//     "iname":"Pale Pink Studio",
//     "ilocation":"Surat",
//     "iratings":3.9,
//     "istart":"200-400 (Printed) ",
//     "iprofilepic":"ic1.png",
//     "irange":"200-2000",
//     "iabout":"Pale Pink Studio is a design studio based out of Surat, owned by Suruchi Gulati. She is a watercolour and digital artist, illustrator, and designer. She is inspired by the natural world around her and everything from the changing colours of the season, to the intricacy of a flower, inspire her. She lives between India, Ireland and the Netherlands but works on projects worldwide. She is passionate about creating lasting and beloved pieces of artwork and illustrations. Every invite that she designs has hand-painted illustrations using watercolours or mixed digital media.",
//     "isince":"2021",
//     "iyearop":"2017",
//     "iservicetype":"All types of card invites available",
//     "ishipping":"Both domestic and International shipping available",
//     "ispeciality":"Boxed,Funky,Modern,Traditional",
//     "iminorder":"20"
//   },
//   {
//     "iname":"Temple Design",
//     "ilocation":"Surat",
//     "iratings":4.7,
//     "istart":"400-600 (Printed) ",
//     "iprofilepic":"ic2.png",
//     "irange":"400-20000",
//     "iabout":"Temple Design is a design studio based out of Surat, owned by Suruchi Gulati. She is a watercolour and digital artist, illustrator, and designer. She is inspired by the natural world around her and everything from the changing colours of the season, to the intricacy of a flower, inspire her. She lives between India, Ireland and the Netherlands but works on projects worldwide. She is passionate about creating lasting and beloved pieces of artwork and illustrations. Every invite that she designs has hand-painted illustrations using watercolours or mixed digital media.",
//     "isince":"2018",
//     "iyearop":"2014",
//     "iservicetype":"All types of card invites available",
//     "ishipping":"Both domestic and International shipping available",
//     "ispeciality":"Boxed,Funky,Modern,Traditional",
//     "iminorder":"30"
//   }
// ]

// Invitation.insertMany(invitedata);


