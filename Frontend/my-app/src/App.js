import './App.css';
import {Component} from 'react'

class App extends Component {
  state = {data:'',username:'',password:'',newpassword:'',username2:'',username3:''}

  onChangeUsername2 = (event) => {
    this.setState({username2:event.target.value})
  }

  onChangeUsername3 = (event) => {
    this.setState({username3:event.target.value})
  }

  onChangeUsername = (event) => {
    this.setState({username:event.target.value})
  }

  onChangePassword = (event) => {
    this.setState({password:event.target.value})
  }
  
  onChangeNewPassword = (event) => {
    this.setState({newpassword:event.target.value})
  }


  getData = async() => {
    console.log("I am Called")
    const response = await fetch("https://sample-mongo.vercel.app/users")
    const data = await response.json()
    console.log(data);
  }

  onPostData = async(event) => {
    event.preventDefault()
    const {username,password} = this.state
    const datas = {username,password}
    let options = {
      method :"POST",
      headers :{
      "Content-Type":"application/json",
      },
      body:JSON.stringify(datas)
    }
    try {
      const response = await fetch("https://sample-mongo.vercel.app/users", options);
      if (!response.ok) {
          throw new Error('Network response was not ok.');
      }
      const responseData = await response.json();
      console.log(responseData.success);
  } catch (error) {
      console.error('Error:', error);
  }
  this.setState({username:'',password:''})
  }

  onUpdateData = async (event) => {
    event.preventDefault()
    const {username2,newpassword} = this.state
    const datas = {username:username2,newpassword}
    const options = {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body:JSON.stringify(datas)
    }
    const response = await fetch("https://sample-mongo.vercel.app/users",options)
    const data = await response.json()
    console.log(data)
  }

  onDeleteUser = async (event) => {
    event.preventDefault()
    const {username3} = this.state
    const datas = {username:username3}
    const options = {
      method : "DELETE",
      headers : {
        "Content-Type" : "application/json"
      },
      body:JSON.stringify(datas)
    }
    const response = await fetch("https://sample-mongo.vercel.app/users",options)
    const data = await response.json()
    console.log(data)
  }



  render(){
    const {username,password,newpassword} = this.state
    return (
      <>
      <h1>Hello World</h1>
      <button type="button" onClick={this.getData}>Get Data</button>
      <h1>Post Data</h1>
      <form onSubmit={this.onPostData}>
        {/* <label htmlFor="username">Username</label>
        <input value={username} onChange={this.onChangeUsername} type="text" id="username" placeholder="Enter the Username" /> */}
        <label htmlFor="password">Password</label>
        <input value={password} onChange={this.onChangePassword} type="password" id="password" placeholder="Enter the Password" />
        <button type="submit">Post Data</button>
      </form>
      <h1>Update Data</h1>
      <form onSubmit={this.onUpdateData}>
        <label htmlFor="username2">Username</label>
        <input value={username} onChange={this.onChangeUsername2} type="text" id="username2" placeholder="Enter the Username" />
        <label htmlFor="newpassword">Password</label>
        <input value={newpassword} onChange={this.onChangeNewPassword} type="password" id="newpassword" placeholder="Enter the Password" />
        <button type="submit">Update Data</button>
      </form>
      <h1>Delete User</h1>
      <form onSubmit={this.onDeleteUser}>
        <label htmlFor="username">Username</label>
        <input id="username3" type="text" placeholder="Enter the username : " onChange={this.onChangeUsername3}/>
        <button type="submit">Delete User</button>
      </form>
      </>
    )
  }
}

export default App;
