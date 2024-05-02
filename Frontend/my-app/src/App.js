import './App.css';
import {Component} from 'react'

let id
class App extends Component {
  state = {dataList:[],username:'',password:'',newpassword:'',username2:'',username3:''}

  componentDidMount(){
    id  = setInterval(this.makeUpdate,300000)
  }


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

  makeUpdate = async () => {
    const response = await fetch("https://sample-mongo.vercel.app/users")
    const data = await response.json()
    for(let values of data){
    const options = {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({username:values.username,counter:values.counter+1,arr:[...values.arr,values.counter+1]})
    }
    const res1 = await fetch("https://sample-mongo.vercel.app/users/updates",options);
    const dat1 = await res1.json()
    console.log(dat1)
  }
    // const options = {
    //   method : "PUT",
    //   headers : {
    //     "Content-Type" : "application/json"
    //   },
    //   body : JSON.stringify()
    // } 
  }


  getData = async() => {
    const response = await fetch("https://sample-mongo.vercel.app/users")
    const data = await response.json()
    this.setState({dataList:data})
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
    this.setState({username3:'',newpassword:''})
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
    this.setState({username3:''})
  }



  render(){
    const {dataList,username,password,newpassword,username2,username3} = this.state
    return (
      <>
      <h1>Hello World</h1>
      <button type="button" onClick={this.getData}>Get Data</button>
      <table>
        <tr>
          <th>Username</th>
          <th>Password</th>
        </tr>
        {dataList.map((ele) =>  (
          <tr key={ele._id}>
            <td>{ele.username}</td>
            <td>{ele.password}</td>
          </tr>
        ))}
      </table>
      <h1>Post Data</h1>
      <form onSubmit={this.onPostData}>
        <label htmlFor="username">Username</label>
        <input value={username} onChange={this.onChangeUsername} type="text" id="username" placeholder="Enter the Username" />
        <label htmlFor="password">Password</label>
        <input value={password} onChange={this.onChangePassword} type="password" id="password" placeholder="Enter the Password" />
        <button type="submit">Post Data</button>
      </form>
      <h1>Update Data</h1>
      <form onSubmit={this.onUpdateData}>
        <label htmlFor="username2">Username</label>
        <input value={username2} onChange={this.onChangeUsername2} type="text" id="username2" placeholder="Enter the Username" />
        <label htmlFor="newpassword">Password</label>
        <input value={newpassword} onChange={this.onChangeNewPassword} type="password" id="newpassword" placeholder="Enter the Password" />
        <button type="submit">Update Data</button>
      </form>
      <h1>Delete User</h1>
      <form onSubmit={this.onDeleteUser}>
        <label htmlFor="username3">Username</label>
        <input value={username3} id="username3" type="text" placeholder="Enter the username : " onChange={this.onChangeUsername3}/>
        <button type="submit">Delete User</button>
      </form>
      </>
    )
  }
}

export default App;
