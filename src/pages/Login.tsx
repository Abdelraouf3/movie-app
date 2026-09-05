import Button from "@/components/UI/Button"
import InputField from "@/components/UI/InputField"


const Login = () => {

    return (
    
        <div className="container mx-auto px-2 sm:px-4 py-24">
        
            <div className="flex-center text-center">
            
                <div className="w-125 border border-white/10 rounded-lg p-4">
                
                    <div className="space-y-2 my-2">
                    
                        <h1 className="text-[25px] font-bold">Welcome back</h1>
                    
                        <p className="text-gray-text">Sign in to your account to continue</p>
                    
                    </div>
                
                    <form 
                        // onSubmit={handleSubmit(onSubmit)}
                        className="space-y-2 pb-2 border-b border-b-white/10"
                    >
                    
                        <div className="space-y-2 text-start">
                        
                            {/* <label htmlFor="email">Email</label> */}
                        
                            <InputField inputLabel="Email" label type="email" placeholder="Enter your email" inputClassName="px-2 rounded-md" />
                            {/* <input type="email" placeholder="Enter your email" className="block border border-white/10 rounded-sm w-full" name="email" id="email" /> */}
                        
                        </div>
                    
                        <div className="space-y-2 text-start">
                        
                            {/* <label htmlFor="password">Password</label> */}
                            <InputField inputLabel="password" label type="password" placeholder="Enter your password" inputClassName="px-2 rounded-md"  />
                            {/* <input type="password" placeholder="Enter your password" className="block border border-white/10 rounded-sm w-full" name="password" id="password" /> */}
                        
                        </div>
                    
                        <Button buttonClassName="w-full disabledBtn mb-3" label="Sign in" disabled />
                    
                    </form>
                
                    <div className="space-y-2 my-2">
                    
                        <h1 className="text-[25px] font-bold">Security Verification</h1>
                    
                        <p className="text-gray-text">Please complete the security check below to continue.</p>
                    
                    </div>
                
                </div>
            
                
            
            </div>
        
        </div>
    
    )

}

export default Login
