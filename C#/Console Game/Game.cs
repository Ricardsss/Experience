using System;

namespace ConsoleGame
{
  class Game : SuperGame
  {
        public new static void UpdatePosition(string keyPressed, out int xChange, out int yChange)
        {
            xChange = 0;
            yChange = 0;
            switch (keyPressed)
            {
                case "LeftArrow":
                    xChange--;
                    break;
                case "RightArrow":
                    xChange++;
                    break;
                case "UpArrow":
                    yChange--;
                    break;
                case "DownArrow":
                    yChange++;
                    break;
            }
        }

        public new static char UpdateCursor(string keyPressed)
        {
            char result = ' ';
            switch (keyPressed)
            {
                case "LeftArrow":
                    result = '<';
                    break;
                case "RightArrow":
                    result = '>';
                    break;
                case "UpArrow":
                    result = '^';
                    break;
                case "DownArrow":
                    result = 'v';
                    break;
            }
            return result;
        }

        public new static int KeepInBounds(int coordinate, int maxValue)
        {
            int result;
            if (coordinate <= 0)
            {
                result = 0;
            } else if (coordinate >= maxValue)
            {
                result = maxValue - 1;
            } else
            {
                result = coordinate;
            }

            return result;
        }

        public new static bool DidScore(int xChar, int yChar, int xFruit, int yFruit)
        {
            return xChar == xFruit && yChar == yFruit;
        }
    }
}