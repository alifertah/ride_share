import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';

function Login() {
  const inputs = ["username", "email", "phone","password","confirmPassword", "birthday"];
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthday: ""
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  /**
   * handle form submit to send register 
   * @param {*} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
        toast.success('Registration successful', {
          position: 'top-right',
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          birthday: ""
        });
        setErrors({});
      } else {
        toast.error('Registration failed: ' + response.statusText, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error('Error registering user: ' + error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  /**
   * Handle input change and validate using regex
   * @param {*} e 
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = {};

    switch (name) {
      case "username":
        setFormData({ ...formData, [name]: value });
        error[name] = /^[a-zA-Z0-9_]+$/.test(value) ? '' : 'Username must contain only letters, numbers, and underscores';
        break;
      case "email":
        setFormData({ ...formData, [name]: value });
        error[name] = /^\S+@\S+\.\S+$/.test(value) ? '' : 'Invalid email address';
        break;
      case "phone":
        setFormData({ ...formData, [name]: value });
        error[name] = /^[0-9]{10}$/.test(value) ? '' : 'Phone number must be 10 digits';
        break;
      case "password":
        setFormData({ ...formData, [name]: value });
        error[name] = /^(?=.*[a-z])/.test(value) ? '' : 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
        break;
      case "confirmPassword":
        setFormData({ ...formData, [name]: value });
        error[name] = value === formData.password ? '' : 'Passwords do not match';
        break;
      case "birthday":
        setFormData({ ...formData, [name]: value });
        error[name] = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value) ? '' : 'Invalid date format (YYYY-MM-DD)';
        break;
      default:
        break;
    }

    setErrors({ ...errors, ...error });
  };

  return (
    <main className='bg-gradient-to-r from-black to-gray-800 h-screen'>
      <div className='flex justify-center items-center '>
        <form className="mt-10 bg-white py-8 pl-40 m-4 pr-20 rounded shadow-inner shadow-md shadow-slate-900" onSubmit={handleSubmit}>
          {inputs.map((value, key) => {
            return (
              <div key={key}>
                <label htmlFor={value} className="block text-xs font-semibold text-gray-600 uppercase mt-2">{value}</label>
                <input  id={value} 
                  type={value === "password" || value === "confirmPassword" ? ("password") : (value === "birthday" ? ("date") : "text")} 
                  name={value} placeholder={value}
                  value={formData[value]}
                  className={`block w-full py-3 px-1 mt-2 
                              text-gray-800 appearance-none 
                              border-b-2 border-gray-100
                              focus:text-gray-500 focus:outline-none focus:border-gray-200
                              ${errors[value] ? 'border-red-500' : ''}`}
                  onChange={handleInputChange}
                  required />
                  {/* {errors[value] && <p className="text-red-500 text-xs">{errors[value]}</p>} */}
              </div>
            );
          })}
          <button type='submit'
            className='bg-[#346751] shadow-md shadow-gray-700 font-semibold text-white py-2 px-12 rounded hover:bg-[#346121] duration-500'
          >
            Register
          </button>

          <div className="sm:flex sm:flex-wrap mt-8 sm:mb-4 text-sm text-center">
            <a href="#" className="flex-2 underline">
              Forgot password?
            </a>

            <p className="flex-1 text-gray-500 text-md mx-4 my-1 sm:my-auto">
              or
            </p>

            <a href="#" className="flex-2 underline">
              Create an Account
            </a>
          </div>
        </form>
        <ToastContainer />
        <Image src="/imgs/login.png" className='hidden lg:ml-[-900px] lg:block' height={500} width={400} />
      </div>
    </main>
  );
}

export default Login;
