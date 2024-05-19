class encryption:
    def encrypt(inputText, N, D):
        encryptedText = "" #encrypted version of inputText
        for char in reversed(inputText):
            if(ord(char) >= 34):
                if D == 1 & char.isupper():
                    encryptedText += chr((ord(char) + N - 65) % 26 + 65)
                elif D == 1 & char.islower():
                    encryptedText += chr((ord(char) + N - 97) % 26 + 97)
                elif D == -1 & char.isupper():
                    encryptedText += chr((ord(char) - N - 65) % 26 + 65)
                elif D == -1 & char.islower():
                    encryptedText += chr((ord(char) - N - 97) % 26 + 97)
                elif D == 1 & char.isdigit():
                    encryptedText += chr((ord(char) + N - 48) % 10 + 48)
                elif D == -1 & char.isdigit():
                    encryptedText += chr((ord(char) - N - 48) % 10 + 48)
            else:
                encryptedText += char
        #print("encrypted: " + encryptedText)
        return encryptedText

    def decrypt(inputText, N, D):
            decryptedText = ""
            for char in reversed(inputText):
                if(ord(char) >= 34):
                    if D == 1 & char.isupper():
                        decryptedText += chr((ord(char) - N - 65) % 26 + 65)
                    elif D == 1 & char.islower():
                        decryptedText += chr((ord(char) - N - 97) % 26 + 97)
                    elif D == -1 & char.isupper():
                        decryptedText += chr((ord(char) + N - 65) % 26 + 65)
                    elif D == -1 & char.islower():
                        decryptedText += chr((ord(char) + N - 97) % 26 + 97)
                    elif D == 1 & char.isdigit():
                        decryptedText += chr((ord(char) - N - 48) % 10 + 48)
                    elif D == -1 & char.isdigit():
                        decryptedText += chr((ord(char) + N - 48) % 10 + 48)
                else:
                    decryptedText += char
            #print(decryptedText) 
            return decryptedText