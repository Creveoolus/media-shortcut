const { React } = require('powercord/webpack'); // We have to import React
const { SwitchItem, TextInput, Category, ButtonItem } = require('powercord/components/settings'); // Here we Import the TextInput Component for later use
const path = require('path');

//This section is the Page the user sees
module.exports = class settings extends React.PureComponent {
  constructor(props) {
	super(props);
  }

  render() {
	return(
	  <div>
		<SwitchItem
			onChange={val => this.props.updateSetting('useFileNames', val)}
			value={this.props.getSetting('useFileNames', true)}
			note='Should Media Shortcuts use file name as shortcuts'
		>
			Use File Names
		</SwitchItem>
		<TextInput
			onChange={val => this.props.updateSetting('mediaDirectory', val)}
			defaultValue={this.props.getSetting('mediaDirectory', __dirname + '\\..\\media\\')}
			disabled={!this.props.getSetting('useFileNames', true)}
			note='Directory used for storing medias'
		>
			Media Directory
		</TextInput>
	  </div>
	)
  }
}