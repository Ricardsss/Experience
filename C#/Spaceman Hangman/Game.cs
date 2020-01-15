using System;

namespace Spaceman
{
    class Game
    {
        public void Greet()
        {
            Console.Write("=============\nUFO: The Game\n=============\n" +
                "Instructions: save your friend from alien abduction by " +
                "guessing the letters in the codeword.");
        }

        public string Codeword { get; set; }
        public string CurrentWord { get; set; }
        public int MaxGuesses { get; set; }
        public int WrongGuesses { get; set; }
        public string[] CodeWords { get; set; }
        public Ufo UfoImages { get; set; }

        public Game()
        {
            CodeWords = new string[]{ "Soccer", "Basketball", "Football",
                "Hockey", "Baseball", "Golf" };
            UfoImages = new Ufo();
            Random rand = new Random();
            int randomIndex = rand.Next(CodeWords.Length);
            Codeword = CodeWords[randomIndex];
            MaxGuesses = 5;
            WrongGuesses = 0;
            for (int i = 0; i < Codeword.Length; i++)
            {
                CurrentWord += "_";
            }
        }

        public bool DidWin()
        {
            return Codeword.Equals(CurrentWord);
        }

        public bool DidLose()
        {
            return WrongGuesses >= MaxGuesses;
        }

        public void Display()
        {
            Console.Write($"{UfoImages.Stringify()}\n");
            Console.Write($"Your current word is {CurrentWord}\n");
            Console.Write($"You have {MaxGuesses - WrongGuesses} guesses " +
                $"remaining\n");
        }

        public void Ask()
        {
            Console.WriteLine("Please guess a letter: ");
            char[] letterGuessed = Console.ReadLine().ToCharArray();
            if (letterGuessed.Length > 1)
            {
                Console.Write("Please enter one letter at a time!\n");
                return;
            } else if (Codeword.Contains(letterGuessed[0]))
            {
                Console.Write($"{letterGuessed[0]} is in the code word.\n");
                for (int i = 0; i < Codeword.Length; i++)
                {
                    if (Codeword[i] == letterGuessed[0])
                    {
                        CurrentWord = CurrentWord.Remove(i, 1).Insert(i,
                            letterGuessed[0].ToString());
                    }
                }
            } else
            {
                Console.Write($"{letterGuessed[0]} is incorrect.\n");
                WrongGuesses++;
                UfoImages.AddPart();
            }

        }
    }
}