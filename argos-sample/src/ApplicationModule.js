/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define('Mobile/Sample/ApplicationModule', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'dojo/query',
    'dojo/dom-class',
    'Mobile/SalesLogix/Format',
    'Sage/Platform/Mobile/ApplicationModule',
    'Mobile/Sample/Views/GroupsList',
    'Mobile/Sample/Views/Account/GroupList',
    'Mobile/Sample/Views/Contact/GroupList',
    'Mobile/Sample/Views/GoogleMap'
], function(
    declare,
    lang,
    string,
    query,
    domClass,
    format,
    ApplicationModule,
    GroupsList,
    AccountGroupList,
    ContactGroupList,
    GoogleMap
) {

    return declare('Mobile.Sample.ApplicationModule', ApplicationModule, {
        //localization strings
		customizationPath: '/slxmobile/products/argos-sample/',
        regionText: 'region',
        faxText: 'fax number',
        helloWorldText: 'Say Hello.',
        helloWorldValueText: 'Click to show alert.',
        parentText: 'parent',

        loadViews: function() {
            this.inherited(arguments);

           //Register views for group support
            this.registerView(new GroupsList());
            this.registerView(new AccountGroupList());
            this.registerView(new ContactGroupList());
           //Register custom Google Map view
            this.registerView(new GoogleMap());
        },
        loadCustomizations: function() {
            this.inherited(arguments);

            //We want to add the Groups list view to the default set of home screen views.
            //Save the original getDefaultviews() function.
            var originalDefViews = Mobile.SalesLogix.Application.prototype.getDefaultViews;
            lang.extend(Mobile.SalesLogix.Application, {
                getDefaultViews: function() {
                    //Get view array from original function, or default to empty array
                    var views = originalDefViews.apply(this, arguments) || [];
                    //Add custom view(s)
                    views.push('groups_list');
                    return views;
                }
            });

            this.registerContactCustomizations();
        },
        registerContactCustomizations: function() {

			
            lang.extend(Mobile.SalesLogix.Views.Contact.Detail, {
                //Add a supporting action for displaying the MBI Custom Action
                MBIResearchAddressZillowAction: function() {
					window.open('http://www.zillow.com/homes/'+format.address(this.entry['Address'], true, ' ')+'_rb',"_blank ");
                 },
                //Add a supporting action for displaying the MBI Custom Action
                MBIResearchContactGoogleAction: function() {
					a = this.entry['FirstName'] + '+' + this.entry['LastName'] + '+' + format.address(this.entry['Address'], true, '+','M+R');
					window.open('http://www.google.com/search?q='+a,"_blank");
                 },
                //Add a supporting action for displaying the MBI Custom Action
                MBIResearchAddressGoogleAction: function() {
					window.open('http://www.google.com/search?q='+format.address(this.entry['Address'], true, ' '),"_blank");
                 },
                //Add a supporting action for displaying the MBI Custom Action
                MBIResearchWeatherAction: function() {
					a = format.address(this.entry['Address'], true, ' ','p');
					window.open('http://m.weather.com/weather/tenday/' + a,"");
                 }
            });


            //MBI Systems: Add a custom action to allow a link to Google the contact at this address
            this.registerCustomization('detail', 'contact_detail', {
                at: function(row) { return row.name == 'ViewAddressAction'; },
                type: 'insert',
                where: 'after',
                value: {
                    name: 'MBIResearchContactGoogle',
					property: 'NameLF',
					label: 'Research: Contact on Google',
					icon: 'content/images/icons/MBI/google_24x24.png',
					action: 'MBIResearchContactGoogleAction'
                }
            });
            //MBI Systems: Add a custom action to allow a link to Google the address
            this.registerCustomization('detail', 'contact_detail', {
                at: function(row) { return row.name == 'ViewAddressAction'; },
                type: 'insert',
                where: 'after',
                value: {
                    name: 'MBIResearchAddressGoogle',
					property: 'Address',
					label: 'Research: Address on Google',
					icon: 'content/images/icons/MBI/google_24x24.png',
					action: 'MBIResearchAddressGoogleAction',
					disabled: this.checkAddress,
					renderer: format.address.bindDelegate(this, true, ' ')
                }
            });
            //MBI Systems: Add a custom action to allow a link to Zillow
            this.registerCustomization('detail', 'contact_detail', {
                at: function(row) { return row.name == 'ViewAddressAction'; },
                type: 'insert',
                where: 'after',
                value: {
                    name: 'MBIResearchAddressZillow',
					property: 'Address',
					label: 'Research: Address on Zillow',
					icon: 'content/images/icons/MBI/zillow_24x24.png',
					action: 'MBIResearchAddressZillowAction',
					disabled: this.checkAddress,
					renderer: format.address.bindDelegate(this, true, ' ')
                }
            });
            //MBI Systems: Add a custom action to allow a link to weather at this address
            this.registerCustomization('detail', 'contact_detail', {
                at: function(row) { return row.name == 'ViewAddressAction'; },
                type: 'insert',
                where: 'after',
                value: {
                    name: 'MBIResearchWeather',
					property: 'Address',
					label: 'Research: Weather from TWC',
					icon: 'content/images/icons/MBI/TWC_logo-100x100.png',
					action: 'MBIResearchWeatherAction',
					disabled: this.checkAddress,
					renderer: format.address.bindDelegate(this, true, ' ')
                }
            });

        },
    });
});
