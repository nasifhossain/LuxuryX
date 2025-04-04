import {useForm} from "react-hook-form"

function ReactHookFormExample() {

    const {register,reset,handleSubmit,formState:{errors}} = useForm()

    function onSubmitForm(formData){
        console.log(formData);
        reset();
        
    }

    return (
        <div>
        
            <form onSubmit={handleSubmit(onSubmitForm)} action="">
                <div>
                    <div>
                        <label htmlFor="">Email</label>
                        <input {...register('email',{
                            required:true,
                        })} type="email" name="email" />
                        {
                            errors.email && errors.email.type=='required'?
                            <p style={{color:"red",fontWeight:'20px'}}>Email is Required</p>:null
                        }
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input {...register('password',{
                            required:true,
                            minLength:8,
                        })} type="password" name="password" id="" />
                        
                    </div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}
export default ReactHookFormExample;