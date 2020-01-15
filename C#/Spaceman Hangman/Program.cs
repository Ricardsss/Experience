using System;

namespace Spaceman
{
  class Program
  {
    static void Main(string[] args)
    {
            Game game = new Game();
            game.Greet();

            while(!(game.DidWin() || game.DidLose()))
            {
                game.Display();
                game.Ask();
            }

            if (game.DidWin())
            {
                Console.Write("Congratulations, you have won!");
            } else
            {
                Console.Write("You have run out of guesses :( Better luck next time!");
            }
    }
  }
}
