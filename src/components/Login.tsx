import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../lib/AuthContext';
import { FoodEmojiShower } from './FoodEmojiShower';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UtensilsCrossed } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'owner' | 'admin'>('user');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowEmojis(true);
    
    try {
      await login(email, password, role);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowEmojis(true);
    
    try {
      await signup(name, email, password, role);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FoodEmojiShower isActive={showEmojis} />
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #FFCBB8 0%, #FFB89A 50%, #FFD4A0 100%)'
      }}>
        {/* Decorative Food Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]">
          <div className="absolute top-20 left-10 text-6xl">🍕</div>
          <div className="absolute top-40 right-20 text-5xl">🍔</div>
          <div className="absolute bottom-32 left-20 text-5xl">🍜</div>
          <div className="absolute bottom-20 right-32 text-6xl">🍰</div>
          <div className="absolute top-1/2 left-1/4 text-4xl">🌮</div>
          <div className="absolute top-1/3 right-1/3 text-4xl">🍣</div>
        </div>

        <Card className="w-full max-w-sm shadow-xl border-0 relative z-10">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-primary to-red-600 rounded-full p-3 shadow-lg">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
                Trezzo
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                🍴 Find your next favorite meal
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="text-sm py-1.5">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm py-1.5">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-sm">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-sm">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-role" className="text-sm">Login As</Label>
                    <select
                      id="login-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'user' | 'owner' | 'admin')}
                      className="w-full px-3 py-2 border rounded-lg bg-input-background h-9 text-sm"
                    >
                      <option value="user">User</option>
                      <option value="owner">Restaurant Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Demo: Use any email/password with your chosen role
                  </p>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-sm">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-sm">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-sm">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-role" className="text-sm">Sign Up As</Label>
                    <select
                      id="signup-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'user' | 'owner' | 'admin')}
                      className="w-full px-3 py-2 border rounded-lg bg-input-background h-9 text-sm"
                    >
                      <option value="user">User</option>
                      <option value="owner">Restaurant Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
