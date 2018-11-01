import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  messages: string[] = [];
  connection: HubConnection;
  messagesForm: FormGroup;
  addUserToGroupResponse: any;
  getUsersByGroupResponse: any;
  getUserSelectionResponse: any;
  clearAllSelectionsForGroupResponse: any;
  getAllActiveGroupDataResponse: any;

  ngOnInit() {
    // SET AND ESTABLISH CONNECTIONS
    this.connection = new HubConnectionBuilder()
      .withUrl('https://gt10-planpoker.azurewebsites.net/streamHub')
      // .withUrl('https://localhost:44325/streamHub')
      .configureLogging(LogLevel.Debug)
      .build();
    this.connection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    // LISTEN TO RESPONSES FROM SERVER
    this.connection.on('addUserToGroup', (user: any) => {
      this.addUserToGroupResponse = user;
    });
    this.connection.on('getUsersByGroup', (users: any) => {
      this.getUsersByGroupResponse = users;
    });
    this.connection.on('setUserSelection', (user: any) => {
      this.getUserSelectionResponse = user;
    });
    this.connection.on('clearAllSelectionsForGroup', (groupName: string) => {
      this.clearAllSelectionsForGroupResponse = groupName;
    });
    this.connection.on('getAllActiveGroupData', (activeGroupData: any) => {
      this.getAllActiveGroupDataResponse = activeGroupData;
    });

    this.messagesForm = new FormGroup({
      groupName: new FormControl(''),
      userName: new FormControl(''),
      selection: new FormControl('')
    });
  }

  addUserToGroup() {
    this.connection
      .invoke('addUserToGroup', this.messagesForm.controls.groupName.value, this.messagesForm.controls.userName.value)
      .catch(err => console.error(err));
  }

  getUsersByGroup() {
    this.connection
      .invoke('getUsersByGroup', this.messagesForm.controls.groupName.value)
      .catch(err => console.error(err));
  }

  setUserSelection() {
    this.connection
      .invoke('setUserSelection', this.messagesForm.controls.groupName.value, this.messagesForm.controls.selection.value)
      .catch(err => console.error(err));
  }

  clearAllSelectionsForGroup() {
    this.connection
      .invoke('clearAllSelectionsForGroup', this.messagesForm.controls.groupName.value)
      .catch(err => console.error(err));
  }

  getAllActiveGroupData() {
    this.connection
      .invoke('getAllActiveGroupData')
      .catch(err => console.error(err));
  }
}
