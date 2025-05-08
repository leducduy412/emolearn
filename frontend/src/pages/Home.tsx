import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smile, Gamepad, Music } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Smile,
      title: "Học về cảm xúc",
      description: "Khám phá cảm xúc thông qua các hoạt động thú vị",
    },
    {
      icon: Gamepad,
      title: "Trò chơi nối cảm xúc",
      description: "Tham gia hoạt động nối cảm xúc",
    },
    {
      icon: Music,
      title: "Nhạc nền thư giãn",
      description: "Khám phá những bản nhạc nhẹ nhàng",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 md:p-8">
      <header className="bg-white rounded-lg shadow-md p-4 mb-8">
        <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4 md:mb-0">
            EmoLearn
          </h1>
          <div className="space-y-2 md:space-y-0 md:space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full md:w-auto"
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => navigate("/register")}
              className="w-full md:w-auto bg-purple-500 hover:bg-purple-600"
            >
              Đăng ký
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <section className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-purple-700 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Chào mừng tới EmoLearn
            </motion.h2>
            <p className="text-xl text-purple-600 mb-6">
              Hãy cùng khám phá thế giới cảm xúc cùng tớ nhé!
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/child-dashboard")}
              className="text-lg px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            >
              Bắt đầu hành trình của bạn
            </Button>
          </section>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* <img
              src="/cartoon1.png"
              alt="Cartoon children expressing different emotions"
              className="mx-auto w-full max-w-[300px] h-auto"
            /> */}
          </motion.div>
        </div>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <feature.icon className="h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-purple-700">
                    {feature.title}
                  </h3>
                  <p className="text-purple-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="text-center bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">
            Bạn đã sẵn sàng cho hành trình khám phá cảm xúc chưa?
          </h2>
          <p className="text-lg text-purple-600 mb-6">
            Hãy tham gia EmoLearn và bắt đầu hành trình thú vị của bạn ngay!
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button
              size="lg"
              onClick={() => navigate("/child-dashboard")}
              className="w-full md:w-auto text-lg px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-purple-700"
            >
              Tôi là trẻ em
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/caretaker-dashboard")}
              className="w-full md:w-auto text-lg px-6 py-3 text-purple-700 border-purple-400 hover:bg-purple-100"
            >
              Tôi là người chăm sóc
            </Button>
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center">
        <p className="text-purple-700">
          &copy; 2025 EmoLearn. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
