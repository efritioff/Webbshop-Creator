import React from "react"


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


<form onSubmit={handleSubmit}>
<input type="email" value={email} onChange={(e => setEmail(e.target.value))} placeholder="youremail@adress.com" />
<input type="password" value={password} onChange={(e => setPassword(e.target.value))} placeholder="Password" />
<button type="submit"></button>
</form>
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    axios
}