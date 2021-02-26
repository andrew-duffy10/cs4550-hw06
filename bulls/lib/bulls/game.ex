defmodule Bulls.Game do

  # Credit to Nat Tuck's 07 Lecture notes
  #https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/07-phoenix/notes.md

  def new do
    %{
      secret: generateSecretCode(),
      guesses: [],
      results: [],
      status: "",
      playing: true,
      players: [],
      ready: 0
    }
  end


  def make_guess(state,numbers) do

    bulls = 0

    word = String.graphemes(numbers)
    #idxs = [0,1,2,3]
    cow_bulls = Enum.reduce(0..3,{0,0},fn x,acc ->
      cond do
           Enum.member?(state.secret,Enum.at(word,x))->
           cond do
           Enum.at(word,x) == Enum.at(state.secret,x) ->
             {elem(acc,0)+1,elem(acc,1)}
           true ->
              {elem(acc,0),elem(acc,1)+1} end

      true ->
        acc

      end
    end)

    out = to_string(elem(cow_bulls,0)) <> "A" <> to_string(elem(cow_bulls,1)) <> "B"

     cond do
      word == state.secret ->
      %{%{%{%{state | guesses: [numbers  | state.guesses]} | results: [out | state.results]} | playing: false} | status: "You Won!"}
      length(state.guesses) >= 7 ->
      %{%{%{%{state | guesses: [numbers | state.guesses]} | results: [out | state.results]} | playing: false} | status: "You lost. The secret was " <> to_string(state.secret)}
      true ->
      %{%{state | guesses: [numbers | state.guesses]} | results: [out | state.results]}

      end
  end




  def view(state,name) do

    %{
    #word: word,
    #guesses: MapSet.to_list(state.guesses)
      name: name,
      guesses: state.guesses,
      results: state.results,
      status: state.status,
      playing: state.playing,
      players: state.players,
      ready: 0
    }
  end

  def generateSecretCode() do
        possible = ["0","1","2","3","4","5","6","7","8","9"]
        code = []
        num1 = Enum.random(possible)
        possible = List.delete(possible,num1)
        code = [num1 | code]
        num2 = Enum.random(possible)
        possible = List.delete(possible,num2)
        code = [num2 | code]
        num3 = Enum.random(possible)
        possible = List.delete(possible,num3)
        code = [num3 | code]
        num4 = Enum.random(possible)
        code = [num4 | code]
        code
        #["1","2","3","4"]
        end
end
