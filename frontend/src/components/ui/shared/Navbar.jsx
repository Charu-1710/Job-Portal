import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Avatar, AvatarImage } from '../avatar';
import { Button } from '../button';
import { User2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constants';
import { setUser } from '@/redux/authSlice';

const Navbar = () => {
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setUser(null))
        navigate('/');
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className='bg-white'>
      <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
        <div>

          <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
        </div>

        <div className='flex items-center gap-12'>
          <ul className='flex font-medium items-center gap-5'>
            {
              user && user.role === 'recruiter' ? (
                <>
                  <li><Link to='/admin/companies'>Companies</Link></li>
                  <li><Link to='/admin/jobs'>Jobs</Link></li>
                </>
              ) : (
                <>
                  <li><Link to='/'>Home</Link></li>
                  <li><Link to='/jobs'>Jobs</Link></li>
                  <li><Link to='/browse'>Browse</Link></li>
                </>

              )
            }

          </ul>
          {
            !user ? (
              <div className='flex items-center gap-2'>
                <Link to='/login'>
                  <Button variant='outline'>Login</Button>
                </Link>
                <Link to='/signup'>
                  <Button className='bg-[#7d51c9] hover:bg-[#6936c1]'>SignUp</Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer'>
                    <AvatarImage src={user?.profile?.profilePhoto} alt="https://github.com/shadcn.png" />

                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='w-80'>
                  <div className='flex gap-4 space-y-2'>
                    <Avatar className='cursor-pointer'>
                      <AvatarImage src={user?.profile?.profilePhoto} alt="https://github.com/shadcn.png" />

                    </Avatar>
                  </div>
                  <h4 className='font-medium'>{user?.fullname}</h4>
                  <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                  {
                    user && user.role === 'student' && (
                      <div className='flex items-center gap-2'>
                        <User2 />
                        <Button variant='link' className='p-0'><Link to='/profile'>View Profile</Link></Button>
                      </div>
                    )
                  }

                  <div className='flex items-center gap-2'>
                    <LogOut />
                    <Button onClick={logoutHandler} variant='link' className='p-0'>Logout</Button>
                  </div>
                </PopoverContent>
              </Popover>
            )

          }

        </div>
      </div>
    </div>
  )
}

export default Navbar
